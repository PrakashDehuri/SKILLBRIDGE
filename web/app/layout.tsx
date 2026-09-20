import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "SkillBridge", description: "Build Skills. Shape Your Career." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
