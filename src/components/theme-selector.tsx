"use client";

import { useEffect, useState } from "react";
import { effectiveTheme, readTheme, saveTheme, THEME_KEY, type ThemePreference } from "@/lib/theme";

export function ThemeSelector() {
  const [preference, setPreference] = useState<ThemePreference>("auto");
  const [error, setError] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function apply(value: ThemePreference) {
      setPreference(value);
      document.documentElement.dataset.theme = effectiveTheme(value, media.matches);
    }
    function read() {
      try {
        apply(readTheme(localStorage));
        setError(false);
      } catch {
        apply("auto");
        setError(true);
      }
    }
    function systemChange() {
      try {
        apply(readTheme(localStorage));
      } catch {
        apply("auto");
      }
    }
    function storageChange(event: StorageEvent) {
      if (event.key === THEME_KEY || event.key === null) read();
    }
    read();
    media.addEventListener("change", systemChange);
    window.addEventListener("storage", storageChange);
    return () => {
      media.removeEventListener("change", systemChange);
      window.removeEventListener("storage", storageChange);
    };
  }, []);
  function change(value: ThemePreference) {
    setPreference(value);
    document.documentElement.dataset.theme = effectiveTheme(
      value,
      window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
    try {
      saveTheme(localStorage, value);
      setError(false);
    } catch {
      setError(true);
    }
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor="theme" className="sr-only">
        Tema de apariencia
      </label>
      <select
        id="theme"
        value={preference}
        onChange={(event) => change(event.target.value as ThemePreference)}
        className="min-h-10 max-w-40 rounded-full border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm"
      >
        <option value="auto">Tema: automático</option>
        <option value="light">Tema: claro</option>
        <option value="dark">Tema: oscuro</option>
      </select>
      {error && (
        <span role="status" className="text-xs text-slate-600">
          No se pudo guardar el tema.
        </span>
      )}
    </div>
  );
}
