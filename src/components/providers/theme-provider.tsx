import { Theme } from "@radix-ui/themes";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import { Toaster } from "@/components/ui/sonner";
import {
  ThemeContext,
  type Appearance,
} from "@/components/providers/use-app-theme";

const THEME_STORAGE_KEY = "app-theme-appearance";

export function AppThemeProvider({ children }: PropsWithChildren) {
  const getInitial = useCallback<() => Appearance>(() => {
    if (typeof window === "undefined") return "light";
    const saved = window.localStorage.getItem(
      THEME_STORAGE_KEY
    ) as Appearance | null;
    if (saved === "light" || saved === "dark") return saved;
    const prefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? "dark" : "light";
  }, []);

  const [appearance, setAppearance] = useState<Appearance>(getInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, appearance);
    } catch (e) {
      console.warn("Failed to persist theme appearance", e);
    }
  }, [appearance]);

  const toggleAppearance = useCallback(() => {
    setAppearance((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(
    () => ({ appearance, setAppearance, toggleAppearance }),
    [appearance, toggleAppearance]
  );

  return (
    <ThemeContext.Provider value={value}>
      <Theme
        appearance={appearance}
        accentColor="indigo"
        hasBackground={true}
        panelBackground="solid"
        grayColor="gray"
        scaling="100%"
        radius="medium"
      >
        {children}
        <Toaster />
      </Theme>
    </ThemeContext.Provider>
  );
}
