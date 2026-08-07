import type { Metadata } from "next";
<<<<<<< HEAD
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
=======
import { Inter, Space_Grotesk, JetBrains_Mono, Roboto_Flex } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { LiveDataProvider } from "@/components/LiveDataProvider";
>>>>>>> origin/teju

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

<<<<<<< HEAD
=======
const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-flex",
});

>>>>>>> origin/teju
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
<<<<<<< HEAD
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-body antialiased`}>
        <Navbar />
        <main>
          {children}
        </main>
=======
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${robotoFlex.variable} font-body antialiased`}
      >
        <Navbar />
        <LiveDataProvider>
          <main>
            {children}
          </main>
        </LiveDataProvider>
>>>>>>> origin/teju
      </body>
    </html>
  );
}
