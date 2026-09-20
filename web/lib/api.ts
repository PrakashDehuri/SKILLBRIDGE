const API_URL = "http://127.0.0.1:8000";

function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("skillbridge_token");
}

async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>).Authorization =
      `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Request failed"
    );
  }

  return data;
}

/* ================================
   BACKEND
================================ */

export async function checkBackend() {
  return apiRequest("/");
}

/* ================================
   AUTH
================================ */

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  return apiRequest("/api/users/", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
}

export async function loginUser(
  email: string,
  password: string
) {
  const data = await apiRequest(
    "/api/users/login",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  if (data.access_token) {
    localStorage.setItem(
      "skillbridge_token",
      data.access_token
    );
  }

  return data;
}

export async function getCurrentUser() {
  return apiRequest("/api/users/me");
}

/* ================================
   PROFILE
================================ */

export async function getProfile() {
  return apiRequest("/api/profile/");
}

export async function updateProfile(
  headline: string,
  target_career: string
) {
  return apiRequest("/api/profile/", {
    method: "PUT",
    body: JSON.stringify({
      headline,
      target_career,
    }),
  });
}

/* ================================
   SKILLS
================================ */

export async function getSkills() {
  return apiRequest("/api/skills/");
}

export async function createSkill(
  skill_name: string,
  skill_level: number
) {
  return apiRequest("/api/skills/", {
    method: "POST",
    body: JSON.stringify({
      skill_name,
      skill_level,
    }),
  });
}

export async function deleteSkill(
  skillId: number
) {
  return apiRequest(
    `/api/skills/${skillId}`,
    {
      method: "DELETE",
    }
  );
}

/* ================================
   MARKET SKILLS
================================ */

export async function getMarketSkills(
  country: string = "IN",
  city?: string,
  limit: number = 5
) {
  const params = new URLSearchParams();

  params.set("country", country);
  params.set("limit", String(limit));

  if (city) {
    params.set("city", city);
  }

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 60000);

  try {
    const response = await fetch(
      `${API_URL}/api/market/skills?${params.toString()}`,
      {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail ||
          "Failed to load market skills."
      );
    }

    return data;
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      throw new Error(
        "Market analysis timed out. Please try again."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/* ================================
   AI ASSISTANT
================================ */

export async function sendAIMessage(
  message: string,
  context?: {
    profile?: unknown;
    skills?: unknown[];
  }
) {
  const response = await fetch(
    `${API_URL}/api/ai/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        context,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "AI request failed"
    );
  }

  return data.reply;
}

/* ================================
   RESUME
================================ */

export async function uploadResume(file: File) {
  const token = getToken();

  if (!token) {
    throw new Error("Please login first");
  }

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/api/resume/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Resume upload failed"
    );
  }

  return data;
}

export async function getResume() {
  return apiRequest("/api/resume/");
}

export async function deleteResume() {
  return apiRequest("/api/resume/", {
    method: "DELETE",
  });
}

export function getResumeDownloadUrl() {
  return `${API_URL}/api/resume/download`;
}