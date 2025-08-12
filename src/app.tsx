import { HashRouter as Router, Routes, Route } from "react-router-dom";

import { Box } from "@radix-ui/themes";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

import { tools, type Tool } from "@/tools";

import { HomePage } from "@/pages/home";
import { ToolPage } from "@/pages/tool-page";

export const App = () => {
  return (
    <Box className="h-screen !grid grid-rows-[auto_1fr_auto]">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {tools.map((tool) => (
            <Route
              key={tool.path}
              path={tool.path}
              element={
                <ToolPage
                  tool={tool as unknown as Tool<Record<string, unknown>>}
                />
              }
            />
          ))}
        </Routes>
        <Footer />
      </Router>
    </Box>
  );
};
