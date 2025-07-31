import { cn } from "@/lib/utils";
import { Box, Flex, Heading, Text, type BoxProps } from "@radix-ui/themes";

export type FooterProps = BoxProps & {};

export const Footer: React.FC<FooterProps> = ({ className, ...props }) => {
  return (
    <Box p={"4"} className={cn("w-full", className)} {...props}>
      <Flex align="center" justify="between">
        <Box>
          <Heading>🛠️ Excalidraw Tools</Heading>
          <Text className="max-w-2xs">
            A collection of tools for Excalidraw, including a table tool.
          </Text>
        </Box>
        <Box></Box>
      </Flex>
    </Box>
  );
};
