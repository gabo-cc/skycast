import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { DemoNotice, PageIntro, SectionHeading } from "@/components/ui";
import { daily, hourly } from "@/lib/demo-weather";

export const metadata: Metadata = { title: "Pronóstico" };
export default function PronosticoPage() {
  return (
    <div className="space-y-10 pt-12 sm:pt-16">
      <PageIntro
        eyebrow="Planea con calma"
        title="El cielo que viene"
        description="Una mirada a las horas y días por venir, presentada de forma sencilla."
      />
      <DemoNotice />
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon name="pin" className="size-4 text-sky-700" /> San Salvador, El Salvador{" "}
        <span className="font-normal text-slate-500">· Ejemplo</span>
      </div>
      <section className="space-y-5">
        <SectionHeading
          title="Por horas"
          description="Una vista de ejemplo para organizar tu día."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {hourly.map((hour) => (
            <article key={hour.time} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-medium text-slate-500">{hour.time}</p>
              <Icon name={hour.icon} className="my-6 size-8 text-sky-600" />
              <p className="text-2xl font-semibold text-slate-900">{hour.temperature}°</p>
            </article>
          ))}
        </div>
      </section>
      <section className="space-y-5">
        <SectionHeading title="Próximos días" description="Un vistazo ilustrativo de la semana." />
        <div className="divide-y divide-slate-100 rounded-3xl border border-slate-200 bg-white px-5 sm:px-7">
          {daily.map((day) => (
            <div
              key={day.day}
              className="grid grid-cols-[1fr_auto] items-center gap-3 py-5 sm:grid-cols-[1fr_2fr_auto]"
            >
              <p className="font-semibold text-slate-800">{day.day}</p>
              <p className="order-3 col-span-2 flex items-center gap-3 text-sm text-slate-500 sm:order-none sm:col-span-1">
                <Icon name={day.icon} className="size-6 text-sky-600" /> {day.condition}
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {day.high}° <span className="ml-2 font-normal text-slate-400">{day.low}°</span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
