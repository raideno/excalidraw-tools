import "@/globals.css";
import "@radix-ui/themes/styles.css";

import { Theme } from "@radix-ui/themes";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/app.tsx";

import { Toaster } from "@/components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme
      accentColor="indigo"
      hasBackground={true}
      panelBackground="solid"
      appearance="light"
      grayColor="gray"
      scaling="100%"
      radius="medium"
    >
      <App />
      <Toaster />
    </Theme>
  </StrictMode>
);
