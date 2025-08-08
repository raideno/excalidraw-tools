import { cn } from "@/lib/utils";
import { Box, Flex, Heading, Text, type BoxProps } from "@radix-ui/themes";
import { MaxWidthBox } from "./max-width-box";

export type FooterProps = BoxProps & {};

export const Footer: React.FC<FooterProps> = ({ className, ...props }) => {
  return (
    <Box
      p={{ initial: "4", sm: "5" }}
      className={cn(
        "w-full border-t border-[color-mix(in_oklab,canvasText,transparent_92%)]",
        className
      )}
      {...props}
    >
      <MaxWidthBox>
        <Flex align="center" justify="between">
          <Box>
            <Heading size="3">🛠️ Excalidraw Tools</Heading>
            <Text className="max-w-2xs" color="gray">
              Handy utilities for building Excalidraw content faster.
            </Text>
          </Box>
          <Box />
        </Flex>
      </MaxWidthBox>
    </Box>
  );
};
