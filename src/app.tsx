import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Box } from "@radix-ui/themes";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ToolPage } from "@/components/layout/tool-page";

import { tools } from "@/tools";

import { HomePage } from "@/pages/home";

export const App = () => {
  return (
    <Box className="h-screen !grid grid-rows-[auto_1fr_auto]">
      <Router basename={__BASE_PATH__}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {tools.map((tool) => (
            <Route path={tool.path} element={<ToolPage tool={tool} />} />
          ))}
        </Routes>
        <Footer />
      </Router>
    </Box>
  );
};
