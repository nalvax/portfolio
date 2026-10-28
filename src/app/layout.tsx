import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { portfolio } from "@/content/portfolio";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: portfolio.site.title,
  description: portfolio.site.description,
  openGraph: { title: portfolio.site.title, description: portfolio.site.description, type: "website" },
  twitter: { card: "summary_large_image", title: portfolio.site.title, description: portfolio.site.description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body className={`${inter.variable} ${mono.variable}`}>{children}</body></html>;
}
