import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  title: "Loadout Lab — Firearms Instruction in Austin, TX | Control. Test. Improve.",
  description: "Professional firearms instruction serving Austin, Kyle, Buda, and San Marcos, TX. Classes taught by a military veteran and federal security professional. Pistol, carbine, defensive shooting, and private instruction.",
  keywords: ["firearms instruction Austin TX", "gun classes Austin Texas", "shooting classes Kyle TX", "shooting classes Buda TX", "shooting classes San Marcos TX", "defensive pistol Austin", "private firearms instruction Austin", "AR-15 training Austin TX", "beginner gun classes Austin", "concealed carry training Austin Texas", "firearms instructor Austin", "range instruction south Austin"],
  openGraph: {
    title: "Loadout Lab",
    description: "Control. Test. Improve. Texas-based firearms instruction.",
    url: "https://loadoutlab.com",
    siteName: "Loadout Lab",
    type: "website",
    images: [
      {
        url: "https://loadoutlab.com/og-image.PNG?v=3",
        width: 1200,
        height: 630,
        alt: "Loadout Lab — Texas Firearms Instruction",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Loadout Lab — Control. Test. Improve.",
    description: "Texas-based firearms instruction from a military veteran and federal security professional.",
    images: ["https://loadoutlab.com/og-image.PNG?v=3"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Loadout Lab",
              "description": "Professional firearms instruction serving Austin, Kyle, Buda, and San Marcos, TX. Classes taught by a military veteran and federal security professional.",
              "url": "https://loadoutlab.com",
              "telephone": "+15125535798",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Austin",
                "addressRegion": "TX",
                "addressCountry": "US"
              },
              "areaServed": [
                {"@type": "City", "name": "Austin"},
                {"@type": "City", "name": "Kyle"},
                {"@type": "City", "name": "Buda"},
                {"@type": "City", "name": "San Marcos"}
              ],
              "founder": {
                "@type": "Person",
                "name": "Luke Eddleman"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Firearms Training Classes",
                "itemListElement": [
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Fundamentals"}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Defensive Pistol"}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Carbine / AR Platform"}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Squad Training"}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Precision Fundamentals"}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Private Instruction"}}
                ]
              }
            })
          }}
        />
      </body>
    </html>
  );
}
