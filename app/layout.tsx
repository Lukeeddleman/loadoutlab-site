import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Loadout Lab — Control. Test. Improve.",
  description: "Texas-based firearms instruction from a military veteran and federal security professional. Classes, gear, and real-world training.",
  keywords: ["firearms instruction", "texas shooting classes", "gun training", "defensive pistol", "AR-15 training", "concealed carry"],
  openGraph: {
    title: "Loadout Lab",
    description: "Control. Test. Improve. Texas-based firearms instruction.",
    url: "https://loadoutlab.com",
    siteName: "Loadout Lab",
    type: "website",
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
      </body>
    </html>
  );
}
