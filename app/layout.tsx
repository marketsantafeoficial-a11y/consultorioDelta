import type { Metadata } from "next";
import { Figtree, Noto_Sans } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Delta Consultorios | Psicólogos en La Plata",
  description:
    "Encontrá tu psicólogo, terapeuta o especialista en salud en La Plata. Turnos online y presenciales, confirmación inmediata.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${figtree.variable} ${notoSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
