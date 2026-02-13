// src/app/layout.tsx
import { Geist, Geist_Mono, Inter, M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const mPlusRounded1c = M_PLUS_Rounded_1c({
  variable: "--font-m-plus-rounded-1c",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata = {
  title: "MathOCR",
  description: "数学の問題をOCR・LaTeX編集・AI解説生成",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="ja">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${mPlusRounded1c.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
