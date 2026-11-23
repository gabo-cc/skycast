import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { PageIntro } from "@/components/ui";

export const metadata: Metadata = { title: "Acerca de" };
export default function AcercaDePage() {
  return (
    <div className="space-y-10 pt-12 sm:pt-16">
      <PageIntro
        eyebrow="Detrás del proyecto"
        title="Un poco sobre SkyCast"
        description="Un proyecto para explorar cómo la tecnología puede hacer que la información del tiempo sea más clara y accesible."
      />
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9">
          <Icon name="sun" className="size-8 text-sky-700" />
          <h2 className="mt-6 text-2xl font-semibold text-slate-900">
            Hecho para mirar hacia arriba
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            SkyCast es una aplicación meteorológica en construcción. Esta primera vista establece
            las páginas y el lenguaje visual del proyecto con datos ilustrativos.
          </p>
          <p className="mt-4 leading-7 text-slate-600">
            La búsqueda, los favoritos y la información meteorológica real se desarrollarán en
            etapas posteriores.
          </p>
        </section>
        <section className="rounded-3xl bg-slate-900 p-7 text-white sm:p-9">
          <Icon name="spark" className="size-7 text-sky-300" />
          <h2 className="mt-6 text-xl font-semibold">Construido paso a paso</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Con Vibe Coding, el desarrollo combina instrucciones, iteraciones y verificación. Cada
            paso queda documentado para aprender y mejorar.
          </p>
          <h3 className="mt-8 text-xs font-bold tracking-[0.16em] text-sky-300 uppercase">
            Tecnologías
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {["Next.js", "React", "TypeScript", "Tailwind CSS", "pnpm"].map((technology) => (
              <li
                key={technology}
                className="rounded-full border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-200"
              >
                {technology}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
