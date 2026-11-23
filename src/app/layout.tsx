import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "SkyCast | Tu cielo, más claro", template: "%s | SkyCast" },
  description: "Una nueva forma de explorar el tiempo, con calma y claridad.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4"
        >
          Saltar al contenido
        </a>
        <SiteHeader />
        <main
          id="contenido"
          className="mx-auto w-full max-w-7xl flex-1 px-5 pb-16 sm:px-8 lg:px-12"
        >
          {children}
        </main>
        <footer className="border-t border-slate-200/80 bg-white/60">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:justify-between sm:px-8 lg:px-12">
            <span>SkyCast · Una mirada más clara al cielo.</span>
            <span>Diseñado para explorar, creado con curiosidad.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
