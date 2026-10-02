import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApplyFlow | Internship Tracker",
  description: "Track internship applications and keep your search organized.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="h-full antialiased"><body className="min-h-full"><AuthProvider>{children}</AuthProvider></body></html>;
}
