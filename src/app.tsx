import { tools } from "@/tools";

import { Box, Flex } from "@radix-ui/themes";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ToolCard } from "@/components/misc/tool-card";

export function App() {
  return (
    <div className="bg-[#F9F9F8]">
      <Box className="w-full min-h-screen max-w-4xl mx-auto elative ">
        <div className="w-full min-h-screen grid grid-rows-[auto_1fr_auto]">
          <Navbar />
          <Box py={{ initial: "2", sm: "4" }} px={{ initial: "4", sm: "8" }}>
            <Flex direction={"column"} gap="4">
              {tools.map((tool) => {
                return <ToolCard key={tool.name} tool={tool} />;
              })}
            </Flex>
          </Box>
          <Footer />
        </div>
      </Box>
    </div>
  );
}
