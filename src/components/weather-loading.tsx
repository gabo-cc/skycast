export function WeatherLoading() {
  return (
    <div role="status" className="space-y-4 pt-12">
      <p className="text-lg font-semibold text-slate-800">Consultando el pronóstico…</p>
      <p className="text-sm text-slate-600">Estamos obteniendo los datos meteorológicos.</p>
    </div>
  );
}
