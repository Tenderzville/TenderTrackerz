export type Theme = "dark" | "light" | "system";

export function getSystemTheme(): Exclude<Theme, "system"> {
  if (typeof window === "undefined") return "light";
  
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: Theme) {
  const root = window.document.documentElement;
  const systemTheme = getSystemTheme();
  
  root.classList.remove("light", "dark");
  
  if (theme === "system") {
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  
  return (localStorage.getItem("ui-theme") as Theme) || "light";
}

export function setStoredTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  
  localStorage.setItem("ui-theme", theme);
}
