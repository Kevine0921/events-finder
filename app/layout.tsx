import "./globals.css";
import { Inter } from "next/font/google";
import Localfont from "next/font/local";
import type { Metadata } from "next";
import { EventsProvider } from "./hooks/useEvents";

import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Localfont({
  src: "../public/fonts/Poppins-Medium.ttf",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  // title: "CommuneAI web3event Map",
  title: "Event Finder App",
  description: "you can find world events here in map",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[inter.variable, poppins.variable].join(" ")}>
      <link rel="icon" type="image/png" href="/favicon.png" />
      <body className="bg-black w-full">
        <Providers>
          <EventsProvider>{children}</EventsProvider>
        </Providers>
      </body>
    </html>
  );
}
