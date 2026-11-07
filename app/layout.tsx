import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import AuthWrapper from "./auth-wrapper";
import { Toaster } from "@/components/ui/toast";
import TopUpWrapper from "./toup-wrapper";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GameDrop — Пополнение игр",
  description: "Быстрое и безопасное пополнение игровой валюты по UID",
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${unbounded.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster />
        <AuthWrapper>
          <TopUpWrapper>{children}</TopUpWrapper>
        </AuthWrapper>
      </body>
    </html>
  );
}
