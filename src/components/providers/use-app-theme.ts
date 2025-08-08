import { createContext, useContext } from "react";

export type Appearance = "light" | "dark";

export type ThemeContextValue = {
  appearance: Appearance;
  setAppearance: (a: Appearance) => void;
  toggleAppearance: () => void;
} | null;

export const ThemeContext = createContext<ThemeContextValue>(null);

export const useAppTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within AppThemeProvider");
  return ctx;
};
