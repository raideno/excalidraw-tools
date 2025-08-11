import { useState, useEffect } from "react";

import { Box, Flex, Heading, Text, Button, Grid } from "@radix-ui/themes";

import { tools } from "@/tools";

import { ToolCard } from "@/components/misc/tool-card";
import { MaxWidthBox } from "@/components/layout/max-width-box";

type FilterType = (typeof tools)[number]["category"];

export const HomePage = () => {
  const loadInitialFilter = (): FilterType => {
    try {
      const saved = localStorage.getItem("excalidraw-tools-home-filter");
      if (saved) {
        const parsed = JSON.parse(saved) as FilterType;
        const filters = Array.from(
          new Set([
            "All",
            ...tools.map((tool) => tool.category),
            "Experimental",
          ])
        ) as FilterType[];
        return filters.includes(parsed) ? parsed : "All";
      }
    } catch (error) {
      console.warn("Failed to load home filter:", error);
    }
    return "All";
  };

  const [activeFilter, setActiveFilter] =
    useState<FilterType>(loadInitialFilter);

  useEffect(() => {
    try {
      localStorage.setItem(
        "excalidraw-tools-home-filter",
        JSON.stringify(activeFilter)
      );
    } catch (error) {
      console.warn("Failed to save home filter:", error);
    }
  }, [activeFilter]);

  const filters: FilterType[] = Array.from(
    new Set(["All", ...tools.map((tool) => tool.category), "Experimental"])
  );

  const filteredTools = tools.filter((tool) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Experimental") return tool.experimental;
    return tool.category === activeFilter;
  });

  return (
    <MaxWidthBox>
      <Box py={{ initial: "3", sm: "5" }} px={{ initial: "3", sm: "4" }}>
        <Flex direction="column" gap="6">
          <Box>
            <Heading size="8" mb="2">
              Excalidraw Tools Collection
            </Heading>
            <Text size="4" color="gray">
              A curated collection of tools to enhance your Excalidraw
              experience. Create tables, progress bars, timelines, and more with
              ease.
            </Text>
          </Box>

          <Box>
            <Text size="3" mb="3" weight="medium">
              Filter by category:
            </Text>
            <Flex gap="2" wrap="wrap">
              {filters.map((filter) => (
                <Button
                  className="!cursor-pointer"
                  key={filter}
                  variant={activeFilter === filter ? "solid" : "outline"}
                  size="2"
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                  {filter === "Experimental" &&
                    ` (${tools.filter((t) => t.experimental).length})`}
                  {filter !== "All" &&
                    filter !== "Experimental" &&
                    ` (${tools.filter((t) => t.category === filter).length})`}
                </Button>
              ))}
            </Flex>
          </Box>

          <Grid columns={{ initial: "1", xs: "2", sm: "3" }} gap="4">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => (
                <ToolCard key={tool.name} tool={tool} />
              ))
            ) : (
              <Box p="6" style={{ textAlign: "center" }}>
                <Text size="4" color="gray">
                  No tools found for the selected filter.
                </Text>
              </Box>
            )}
          </Grid>
        </Flex>
      </Box>
    </MaxWidthBox>
  );
};
