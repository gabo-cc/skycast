export type ThemePreference = "auto" | "light" | "dark";
export const THEME_KEY = "skycast:tema";
export function themePreference(value: string | null): ThemePreference {
  return value === "light" || value === "dark" ? value : "auto";
}
export function effectiveTheme(preference: ThemePreference, systemDark: boolean): "light" | "dark" {
  return preference === "auto" ? (systemDark ? "dark" : "light") : preference;
}
export function readTheme(storage: Pick<Storage, "getItem">): ThemePreference {
  return themePreference(storage.getItem(THEME_KEY));
}
export function saveTheme(storage: Pick<Storage, "setItem">, preference: ThemePreference): void {
  storage.setItem(THEME_KEY, preference);
}
