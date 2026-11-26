"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { ThemeSelector } from "@/components/theme-selector";
import { usePathname } from "next/navigation";

const links = [
  ["Inicio", "/"],
  ["Buscar", "/buscar"],
  ["Pronóstico", "/pronostico"],
  ["Favoritos", "/favoritos"],
  ["Comparar", "/comparar"],
  ["Acerca de", "/acerca-de"],
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="border-b border-slate-200/80 bg-white/85">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-8">
        <Link
          href="/"
          className="flex w-fit items-center gap-1.5 text-xl font-bold tracking-tight text-sky-800"
        >
          <Icon name="cloud" className="size-7 text-sky-600" />
          SkyCast
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
                    aria-current={pathname === href ? "page" : undefined}
                    onClick={(event) =>
                      event.currentTarget.closest("details")?.removeAttribute("open")
                    }
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
                  aria-current={pathname === href ? "page" : undefined}
                  className="block rounded-none border-b-2 border-transparent px-3 py-3 text-sm font-medium text-slate-600 transition hover:text-sky-800"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeSelector />
      </div>
    </header>
  );
}
