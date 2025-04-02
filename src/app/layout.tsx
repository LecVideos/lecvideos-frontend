import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Topbar from "./app-components/topbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LecVideos",
  description: "An app for streaming lecture videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          {/* Topbar this will appear on every page */}
          <Topbar/>

          {/* Main Content Area */}
          <div className="flex flex-col flex-1">
            {children}
          </div>
        </div>
        
      </body>
    </html>
  );
}
//className="overflow-hidden flex flex-col flex-1"