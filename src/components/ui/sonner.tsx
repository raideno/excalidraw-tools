import type { ToasterProps as SonnerToasterProps } from "sonner";

import { Toaster as SonnerToaster } from "sonner";

export type ToasterProps = SonnerToasterProps & {};

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <SonnerToaster
      theme={"light"}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};
