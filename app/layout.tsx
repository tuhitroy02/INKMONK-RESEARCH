import type { Metadata } from "next";
import { Comic_Neue } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-comic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "InkMonk Research — Research with care. Writing with clarity.",
    template: "%s | InkMonk Research",
  },
  description:
    "InkMonk Research offers premier research and writing services in English and Hindi — research papers, theses, books, articles, presentations, and Turnitin reports. Based in Kolkata.",
  keywords: [
    "research paper writing",
    "thesis writing",
    "academic writing",
    "Hindi research paper",
    "English research paper",
    "Turnitin report",
    "InkMonk Research",
    "Kolkata research writing",
  ],
  authors: [
    { name: "Tuhit Roy" },
    { name: "Sampreeti Mukherjee" },
  ],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${comicNeue.variable} scroll-smooth`}>
      <body
        className="min-h-screen bg-[#F9F7F4] text-[#1E293B] font-bold antialiased selection:bg-orange-500 selection:text-white"
        style={{ fontFamily: '"Comic Sans MS", "Comic Sans", "Comic Neue", cursive, sans-serif', fontWeight: 700 }}
      >
        <Navbar />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
