import Link from "next/link";
import { Icon } from "@/components/icon";

const links = [
  ["Inicio", "/"],
  ["Buscar", "/buscar"],
  ["Pronóstico", "/pronostico"],
  ["Favoritos", "/favoritos"],
  ["Comparar", "/comparar"],
  ["Acerca de", "/acerca-de"],
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200/80 bg-white/85">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 px-5 py-4 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="flex w-fit items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
            <Icon name="sun" className="size-5" />
          </span>
          SkyCast<span className="text-sky-600">.</span>
        </Link>
        <details className="group relative lg:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 marker:content-none hover:bg-sky-50 [&::-webkit-details-marker]:hidden">
            Menú{" "}
            <span aria-hidden="true" className="text-sky-700 group-open:rotate-180">
              ▾
            </span>
          </summary>
          <nav
            aria-label="Navegación móvil"
            className="absolute right-0 z-20 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
          >
            <ul>
              {links.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-800"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
        <nav aria-label="Navegación principal" className="hidden lg:block">
          <ul className="flex flex-wrap items-center gap-1">
            {links.map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-800"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
