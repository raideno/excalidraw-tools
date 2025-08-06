import { Box, Card, Flex, Heading, Text, Badge } from "@radix-ui/themes";

import type { Tool } from "@/tools";

export interface ToolCardProps {
  tool: Tool;
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  return (
    <Card style={{ position: "relative" }}>
      <Flex direction={"column"} gap={"4"} p="4">
        <Box>
          <Flex direction={"row"} justify={"between"} align={"center"}>
            <Heading>{tool.name}</Heading>
            {tool.experimental && <Badge color="orange">Experimental</Badge>}
          </Flex>
          <Text>{tool.description}</Text>
        </Box>
        <tool.component />
      </Flex>
    </Card>
  );
};
