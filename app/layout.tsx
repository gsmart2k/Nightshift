import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NIGHTSHIFT — Portfolio Stress Lab",
  description: "Rehearse a difficult market night. Inspect portfolio stress, historical evidence and execution assumptions.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
