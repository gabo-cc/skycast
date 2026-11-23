import type { Metadata } from "next";
import { Comparison } from "@/components/comparison";
import { PageIntro } from "@/components/ui";

export const metadata: Metadata = { title: "Comparar ciudades" };
export default function CompararPage() {
  return (
    <div className="space-y-10 pt-12 sm:pt-16">
      <PageIntro
        eyebrow="Lado a lado"
        title="Compara dos cielos"
        description="Selecciona dos ciudades para comparar sus condiciones meteorológicas actuales."
      />
      <Comparison />
    </div>
  );
}
