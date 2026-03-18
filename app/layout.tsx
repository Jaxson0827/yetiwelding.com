import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import CartProviderWrapper from "@/components/CartProviderWrapper";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://yetiwelding.com"),
  title: "Yeti Welding | Professional Welding Services | Custom Fabrication | Utah",
  description: "Yeti Welding delivers exceptional welding and fabrication services. Founded in 2016 and based in Springville, Utah. Specializing in custom fabrication, structural welding, and ornamental work. Trusted craftsmanship that speaks for itself.",
  keywords: ["welding", "custom fabrication", "structural welding", "ornamental welding", "welding services", "metal fabrication", "Yeti Welding", "Utah welding", "Springville welding", "steel fabrication"],
  authors: [{ name: "Yeti Welding" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Yeti Welding | Professional Welding Services | Custom Fabrication",
    description: "Founded in 2016. Trusted craftsmanship in custom fabrication, structural welding, and ornamental work. Based in Springville, Utah.",
    type: "website",
    locale: "en_US",
    url: "https://yetiwelding.com",
    siteName: "Yeti Welding",
    images: [
      {
        url: "/homepage/hero.JPG",
        width: 1200,
        height: 630,
        alt: "Yeti Welding Workshop - Professional Welding Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yeti Welding | Professional Welding Services",
    description: "Founded in 2016. Trusted craftsmanship in custom fabrication, structural welding, and ornamental work.",
    images: ["/homepage/hero.JPG"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://yetiwelding.com",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RDV6512BRX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RDV6512BRX');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ScrollProgressBar />
        <CartProviderWrapper>{children}</CartProviderWrapper>
        <Analytics />
      </body>
    </html>
  );
}

