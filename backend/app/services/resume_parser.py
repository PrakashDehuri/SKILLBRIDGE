from pathlib import Path

from pypdf import PdfReader
from docx import Document


def extract_pdf_text(file_path: str) -> str:
    reader = PdfReader(file_path)

    pages = []

    for page in reader.pages:
        text = page.extract_text()

        if text:
            pages.append(text)

    return "\n".join(pages).strip()


def extract_docx_text(file_path: str) -> str:
    document = Document(file_path)

    paragraphs = []

    for paragraph in document.paragraphs:
        text = paragraph.text.strip()

        if text:
            paragraphs.append(text)

    return "\n".join(paragraphs).strip()


def extract_resume_text(
    file_path: str,
    file_type: str
) -> str:

    extension = file_type.lower().replace(".", "")

    if extension == "pdf":
        text = extract_pdf_text(file_path)

    elif extension == "docx":
        text = extract_docx_text(file_path)

    else:
        raise ValueError(
            "Only PDF and DOCX files are supported"
        )

    if not text:
        raise ValueError(
            "Could not extract readable text from the resume"
        )

    return text