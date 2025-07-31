import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";

import type { Tool } from "@/tools";

export interface ToolCardProps {
  tool: Tool;
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  return (
    <Card>
      <Flex direction={"column"} gap={"4"} p="4">
        <Box>
          <Heading>{tool.name}</Heading>
          <Text>{tool.description}</Text>
        </Box>
        <tool.component />
      </Flex>
    </Card>
  );
};
