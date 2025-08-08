import type React from "react";
import type { BoxProps } from "@radix-ui/themes";

import { cn } from "@/lib/utils";

import { Box } from "@radix-ui/themes";

export type MaxWidthBoxProps = BoxProps & {};

export const MaxWidthBox: React.FC<MaxWidthBoxProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Box className={cn("max-w-4xl mx-auto", className)} {...props}>
      {children}
    </Box>
  );
};
