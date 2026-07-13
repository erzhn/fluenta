import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Fluenta — AI English Academy",
    template: "%s | Fluenta",
  },
  description: "Учи английский с AI-репетитором 24/7. Уроки A1-C2, произношение, словарь, геймификация. Бесплатно.",
  keywords: ["английский онлайн", "учить английский", "AI репетитор английского", "IELTS подготовка", "fluenta"],
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-icon.svg",
    apple: "/logo-icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Fluenta",
  },
  openGraph: {
    title: "Fluenta — AI English Academy",
    description: "Учи английский с AI-репетитором 24/7. Уроки, словарь, произношение.",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://fluenta.vercel.app",
    siteName: "Fluenta",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fluenta — AI English Academy",
    description: "Учи английский с AI-репетитором 24/7.",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366F1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const THEME_SCRIPT = [
  "(function(){",
  "try{",
  "var t=localStorage.getItem('fluenta_theme');",
  "if(t==='dark'){document.documentElement.classList.add('dark');}",
  "else{document.documentElement.classList.remove('dark');}",
  "}catch(e){}",
  "})();"
].join("");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: [
              "if('serviceWorker' in navigator){",
              "window.addEventListener('load',function(){",
              "navigator.serviceWorker.register('/sw.js').catch(function(){});",
              "});",
              "}"
            ].join("")
          }}
        />
      </body>
    </html>
  );
}
