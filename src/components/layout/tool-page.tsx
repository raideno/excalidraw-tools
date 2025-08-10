import { Link } from "react-router-dom";

import { ArrowLeftIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { Box, Flex, Heading, Text, Badge, Button } from "@radix-ui/themes";

import type { Tool } from "@/tools";
import { MaxWidthBox } from "@/components/layout/max-width-box";

export interface ToolPageProps {
  tool: Tool;
}

export const ToolPage = ({ tool }: ToolPageProps) => {
  return (
    <Box>
      <MaxWidthBox p={{ initial: "3", sm: "4" }}>
        <Box py={{ initial: "3", sm: "5" }}>
          <Flex direction="column" gap="6">
            <Flex direction={"row"} justify={"between"} align={"center"}>
              <Link to={"/"}>
                <Button variant="ghost" className="!cursor-pointer">
                  <ArrowLeftIcon /> Back to Tools
                </Button>
              </Link>

              <Link target="_blank" to={"https://excalidraw.com"}>
                <Button variant="outline" className="!cursor-pointer">
                  <ExternalLinkIcon /> Excalidraw
                </Button>
              </Link>
            </Flex>

            <Box>
              <Flex direction="row" justify="between" align="center" mb="2">
                <Heading size="7">{tool.name}</Heading>
                {tool.experimental && (
                  <Badge color="orange">Experimental</Badge>
                )}
              </Flex>
              <Text size="4" color="gray">
                {tool.description}
              </Text>
            </Box>

            <Box>
              <tool.component />
            </Box>
          </Flex>
        </Box>
      </MaxWidthBox>
    </Box>
  );
};
