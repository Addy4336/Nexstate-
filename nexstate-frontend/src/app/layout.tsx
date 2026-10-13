import { brand } from "@nexstate/brand";
import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import "./prose.css";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/owner/FooterSection";
import { MotionProvider } from "@/components/motion/MotionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Variable serif for headings; opsz axis keeps large display sizes refined.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: {
    default: `${brand.name} - ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  openGraph: {
    siteName: brand.name,
    type: "website",
    description: brand.description,
  },
};

export const viewport: Viewport = {
  themeColor: brand.themeColor,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${fraunces.variable} antialiased font-sans`}
      >
        <MotionProvider>
          <Navbar />
          {children}
          <FooterSection />
        </MotionProvider>
      </body>
    </html>
  );
}
