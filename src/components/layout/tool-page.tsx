import { ArrowLeftIcon } from "@radix-ui/react-icons";
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Button,
  Link,
} from "@radix-ui/themes";

import type { Tool } from "@/tools";
import { MaxWidthBox } from "@/components/layout/max-width-box";

export interface ToolPageProps {
  tool: Tool;
}

export const ToolPage = ({ tool }: ToolPageProps) => {
  return (
    <div className="bg-[var(--color-panel)] min-h-screen">
      <MaxWidthBox p={{ initial: "3", sm: "4" }}>
        <Box py={{ initial: "3", sm: "5" }}>
          <Flex direction="column" gap="6">
            <Link href={__BASE_PATH__}>
              <Button variant="ghost" style={{ alignSelf: "flex-start" }}>
                <ArrowLeftIcon /> Back to Tools
              </Button>
            </Link>

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
    </div>
  );
};
