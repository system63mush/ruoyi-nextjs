import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

const notoSansSC = Noto_Sans_SC({ 
  subsets: ["latin"],
  variable: "--font-noto-sans-sc"
});

export const metadata: Metadata = {
  title: "若依管理系统",
  description: "基于Next.js的现代化权限管理系统",
  keywords: ["管理系统", "权限管理", "Next.js", "React"],
  authors: [{ name: "若依科技" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${notoSansSC.variable}`}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
