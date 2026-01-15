import type { Metadata } from "next";
import "./globals.css";
import CartProviderWrapper from "@/components/CartProviderWrapper";

export const metadata: Metadata = {
  title: "Yeti Welding | Professional Welding Services | Custom Fabrication | Utah",
  description: "Yeti Welding delivers exceptional welding services with 40+ years of experience. Specializing in custom fabrication, structural welding, and ornamental work. Based in Springville, Utah. Trusted craftsmanship that speaks for itself.",
  keywords: ["welding", "custom fabrication", "structural welding", "ornamental welding", "welding services", "metal fabrication", "Yeti Welding", "Utah welding", "Springville welding", "steel fabrication"],
  authors: [{ name: "Yeti Welding" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Yeti Welding | Professional Welding Services | Custom Fabrication",
    description: "40+ years of experience in custom fabrication, structural welding, and ornamental work. Trusted craftsmanship that delivers results. Based in Springville, Utah.",
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
    description: "40+ years of experience in custom fabrication, structural welding, and ornamental work. Trusted craftsmanship that delivers results.",
    images: ["/homepage/hero.JPG"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://yetiwelding.com",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <CartProviderWrapper>{children}</CartProviderWrapper>
      </body>
    </html>
  );
}

