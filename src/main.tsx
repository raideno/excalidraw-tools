import "@/globals.css";
import "@radix-ui/themes/styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/app.tsx";

import { AppThemeProvider } from "@/components/providers/theme-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </StrictMode>
);
