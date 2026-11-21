import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
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

// canonical задаётся на каждой странице отдельно (alternates.canonical) —
// в корне его ставить нельзя, иначе все страницы унаследуют canonical «/»
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ru_RU",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Коды подтверждения из Яндекс.Вебмастера и Google Search Console
  verification: {
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    // Подтверждение домена в AuraPay
    other: {
      AURAPAY_VXO36QWcNvI6DcBO: "undefined",
    },
  },
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
