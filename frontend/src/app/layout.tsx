import type { Metadata, Viewport } from "next";
import "@fontsource-variable/nunito-sans";
import "@fontsource/source-code-pro";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { SystemHUD } from "@/components/layout/SystemHUD";

export const metadata: Metadata = {
  title: "CrisisBuild | Offline Reconstruction",
  description: "Tactical offline-first construction management for post-disaster scenarios.",
  manifest: "/manifest.json",
  icons: {
    icon: "/crisisbuild_logo.svg",
    shortcut: "/crisisbuild_logo.svg",
    apple: "/crisisbuild_logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0C1810",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`antialiased h-full bg-background text-text-primary flex overflow-hidden`}
      >
        <Sidebar />
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
          <SystemHUD />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
