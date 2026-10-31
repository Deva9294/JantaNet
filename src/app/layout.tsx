import type { Metadata, Viewport } from "next";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: { default: "JantaNet — Connect • Chat • Share • Earn", template: "%s | JantaNet" },
  description: "A people-first digital community to connect, chat, share ideas and grow together.",
  applicationName: "JantaNet",
  keywords: ["JantaNet", "community", "social network", "messaging", "creators"],
  openGraph: {
    title: "JantaNet — Connect • Chat • Share • Earn",
    description: "A people-first digital community to connect, chat, share ideas and grow together.",
    type: "website",
    siteName: "JantaNet"
  },
  twitter: { card: "summary_large_image", title: "JantaNet", description: "Connect • Chat • Share • Earn" },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080d1b"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
