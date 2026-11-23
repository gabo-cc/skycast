import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { PageIntro } from "@/components/ui";

export const metadata: Metadata = { title: "Favoritos" };
export default function FavoritosPage() {
  return (
    <div className="space-y-10 pt-12 sm:pt-16">
      <PageIntro
        eyebrow="Tus lugares"
        title="Siempre cerca"
        description="Un espacio pensado para tener a mano los cielos que más te importan."
      />
      <section className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
        <span className="rounded-2xl bg-sky-50 p-4 text-sky-700">
          <Icon name="heart" className="size-8" />
        </span>
        <h2 className="mt-6 text-xl font-semibold text-slate-900">Aún no hay ciudades favoritas</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
          En una próxima etapa podrás guardar tus lugares favoritos aquí. Mientras tanto, conoce las
          ciudades de ejemplo.
        </p>
        <Link
          href="/buscar"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-800"
        >
          Explorar ciudades <Icon name="arrow" className="size-4" />
        </Link>
      </section>
    </div>
  );
}
