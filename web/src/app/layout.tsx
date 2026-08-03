import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, Roboto_Flex } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { LiveDataProvider } from "@/components/LiveDataProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-flex",
});

export const metadata: Metadata = {
  title: "KSCA U-19 | Cricket Analytics",
  description: "Cricket analytics dashboard for KSCA U-19 Inter Club Tournament",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${robotoFlex.variable} font-body antialiased`}
      >
        <Navbar />
        <LiveDataProvider>
          <main>
            {children}
          </main>
        </LiveDataProvider>
      </body>
    </html>
  );
}
