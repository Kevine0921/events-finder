import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Commune AI World Event Finder",
  description: "Find events around the world",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.css"
          type="text/css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;600;700&family=Lato:wght@300;400;700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,700;1,800&family=Roboto:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="container mx-auto overflow-auto font-pop bg-[#00001a]">
        {children}
      </body>
    </html>
  );
}
