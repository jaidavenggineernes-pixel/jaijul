import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticlesBackground } from "@/components/layout/ParticlesBackground";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vanguard Class - X RPL 2 SMKN 1 PACITAN",
  description: "Website resmi kelas X RPL 2 (Vanguard) di SMKN 1 PACITAN. Kelas yang berfokus pada Rekayasa Perangkat Lunak.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col font-[family-name:var(--font-outfit)]`}
      >
        <ParticlesBackground />
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
