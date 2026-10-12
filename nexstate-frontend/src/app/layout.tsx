import type { Metadata, Viewport } from "next";
import { brand } from "@nexstate/brand";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./prose.css";
import Navbar from "@/components/Navbar";
import ContactNavbar from "@/components/contact/ContactNavbar";
import FooterSection from "@/components/owner/FooterSection";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
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
        className={`${outfit.variable} ${playfair.variable} antialiased font-sans`}
      >
        <Navbar />
        {/* <ContactNavbar /> */}
        {children}
        <FooterSection />
      </body>
    </html>
  );
}
