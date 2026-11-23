import type { Metadata } from "next";
import { CitySearch } from "@/components/city-search";
import { PageIntro } from "@/components/ui";

export const metadata: Metadata = { title: "Buscar ciudades" };

export default function BuscarPage() {
  return (
    <div className="space-y-10 pt-12 sm:pt-16">
      <PageIntro
        eyebrow="Explora el mundo"
        title="Encuentra una ciudad"
        description="Busca ciudades de diferentes países y selecciona el lugar que te interesa."
      />
      <CitySearch />
    </div>
  );
}
