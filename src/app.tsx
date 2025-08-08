import { tools } from "@/tools";

import { Box, Flex } from "@radix-ui/themes";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ToolCard } from "@/components/misc/tool-card";
import { MaxWidthBox } from "@/components/layout/max-width-box";

export const App = () => {
  return (
    <div className="bg-[var(--color-panel)]">
      <Navbar />
      <MaxWidthBox>
        <Box py={{ initial: "3", sm: "5" }}>
          <Flex direction={"column"} gap="4">
            {tools.map((tool) => {
              return <ToolCard key={tool.name} tool={tool} />;
            })}
          </Flex>
        </Box>
      </MaxWidthBox>
      <Footer />
    </div>
  );
};
