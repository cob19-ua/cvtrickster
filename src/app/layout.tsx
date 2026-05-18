import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CVTrickster",
  description: "Adapt your CV to any job offer in seconds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">CVTrickster</span>
        </header>
        <main className="mx-auto max-w-3xl px-6 py-12">{children}</main>
      </body>
    </html>
  );
}
