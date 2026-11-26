import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { WeatherAttribution } from "@/components/weather-attribution";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "SkyCast | Tu cielo, más claro", template: "%s | SkyCast" },
  description: "Una nueva forma de explorar el tiempo, con calma y claridad.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem('skycast:tema');document.documentElement.dataset.theme=p==='dark'||(p!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}})();`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4"
        >
          Saltar al contenido
        </a>
        <SiteHeader />
        <main id="contenido" className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12 sm:px-8">
          {children}
        </main>
        <footer className="border-t border-slate-200/80 bg-white/60">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:justify-between sm:px-8 lg:px-12">
            <span>
              <strong className="text-slate-900">SkyCast.</strong> Una mirada más clara al cielo.
            </span>
            <span>
              Datos meteorológicos: <WeatherAttribution />. Ubicaciones:{" "}
              <a href="https://www.geonames.org/" className="underline underline-offset-2">
                GeoNames
              </a>
              .
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
