import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TAVUS.IO // NHIL.NET — The Sovereign Human Computing & Automation Company",
  description:
    "Personified Application Layers (PALs) and No-Human-In-The-Loop (NHIL) Spec-Driven Enterprise Automation. We are way beyond static models. We are engineering living worlds in code now. Generated at runtime.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased selection:bg-primary selection:text-primary-foreground">
        {children}
      </body>
    </html>
  );
}
