"use client";

export function WeatherError({ retry }: { retry: () => void }) {
  return (
    <div role="alert" className="space-y-4 pt-12">
      <h1 className="text-2xl font-semibold text-slate-900">No pudimos cargar el pronóstico</h1>
      <p className="text-slate-600">
        El servicio meteorológico no está disponible en este momento. Inténtalo de nuevo.
      </p>
      <button
        type="button"
        onClick={retry}
        className="min-h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-sky-800"
      >
        Reintentar
      </button>
    </div>
  );
}
