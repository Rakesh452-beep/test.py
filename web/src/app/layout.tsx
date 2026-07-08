import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "KSCA U-19 | Cricket Analytics Dashboard",
  description: "Premium cricket analytics dashboard for KSCA U-19 Inter Club Tournament — batting, bowling & wicketkeeper statistics with real-time insights",
  keywords: ["KSCA", "cricket", "U-19", "tournament", "analytics", "dashboard"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} font-sans antialiased`}>
        <Navbar />
        <main className="min-h-screen pt-16 lg:pt-0 lg:pl-64">
          {children}
        </main>
      </body>
    </html>
  );
}
