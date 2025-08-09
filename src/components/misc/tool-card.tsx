import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

import type { Tool } from "@/tools";

export interface ToolCardProps {
  tool: Tool;
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(tool.path);
  };

  return (
    <Card
      className="!cursor-pointer relative hover:outline hover:outline-[var(--accent-9)]"
      onClick={handleCardClick}
    >
      <Flex direction="column" gap="4" p="4">
        {tool.icon && <Box>{tool.icon}</Box>}
        <Box>
          <Heading size="5">{tool.name}</Heading>
          <Text color="gray">{tool.description}</Text>
        </Box>
      </Flex>
    </Card>
  );
};
