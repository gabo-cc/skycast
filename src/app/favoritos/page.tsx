import type { Metadata } from "next";
import { FavoriteCities } from "@/components/favorite-cities";
import { PageIntro } from "@/components/ui";

export const metadata: Metadata = { title: "Favoritos" };
export default function FavoritosPage() {
  return (
    <div className="space-y-10 pt-12 sm:pt-16">
      <PageIntro
        eyebrow="Tus lugares"
        title="Siempre cerca"
        description="Ten a mano los cielos que más te importan."
      />
      <FavoriteCities />
    </div>
  );
}
