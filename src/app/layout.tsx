import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import Encabezado from "@/components/Encabezado";
import PiePagina from "@/components/PiePagina";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      // Variable que Vercel define automáticamente con el dominio de producción
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: {
    default: "Destinos SV · Guía de viaje por El Salvador",
    template: "%s · Destinos SV",
  },
  description:
    "Playas, volcanes, lagos, pueblos y sitios arqueológicos de El Salvador. Descubre destinos, compara precios de entrada y lee reseñas de otros viajeros.",
  openGraph: {
    type: "website",
    locale: "es_SV",
    siteName: "Destinos SV",
    images: ["/img/destinos/lago-de-coatepeque.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geist.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#contenido"
          className="sr-only z-50 rounded-full bg-mar-600 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Saltar al contenido
        </a>
        <Encabezado />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <PiePagina />
      </body>
    </html>
  );
}
