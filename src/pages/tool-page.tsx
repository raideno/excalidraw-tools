import React from "react";

import { Excalidraw } from "@excalidraw/excalidraw";

import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

import { Link } from "react-router-dom";

import { ArrowLeftIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Button,
  Card,
} from "@radix-ui/themes";

import type { Tool } from "@/tools";

import { useToolManager } from "@/lib/use-tool-manager";

import { MaxWidthBox } from "@/components/layout/max-width-box";
import { HistoryPanel } from "@/components/misc/history-panel";
import { StatusDisplay } from "@/components/misc/status-display";
import { useAppTheme } from "@/components/providers/use-app-theme";

export interface ToolPageProps {
  tool: Tool<Record<string, unknown>>;
}

export const ToolPage = ({ tool }: ToolPageProps) => {
  const {
    configuration,
    updateConfiguration,
    status,
    isLoading,
    generateAndCopy,
    history,
    loadFromHistory,
    deleteFromHistory,
    clearHistory,
    resetConfiguration,
    closeStatus,
  } = useToolManager({
    toolName: tool.name,
    defaultConfiguration: tool.configuration.defaultConfiguration,
    generateFunction: tool.configuration.generateFunction,
    getHistoryName: tool.configuration.getHistoryName,
    version: tool.configuration.version || 1,
  });

  const { appearance } = useAppTheme();

  const [excalidrawApi, setExcalidrawApi] =
    React.useState<ExcalidrawImperativeAPI | null>(null);

  const autoFitContent = React.useCallback(
    (elements: unknown, api: ExcalidrawImperativeAPI) => {
      if (!Array.isArray(elements) || elements.length === 0 || !api) return;

      try {
        let minX = Infinity,
          minY = Infinity,
          maxX = -Infinity,
          maxY = -Infinity;
        let hasValidElements = false;

        elements.forEach(
          (element: {
            x?: number;
            y?: number;
            width?: number;
            height?: number;
          }) => {
            if (
              typeof element?.x === "number" &&
              typeof element?.y === "number"
            ) {
              hasValidElements = true;
              const width = element.width || 0;
              const height = element.height || 0;
              minX = Math.min(minX, element.x);
              minY = Math.min(minY, element.y);
              maxX = Math.max(maxX, element.x + width);
              maxY = Math.max(maxY, element.y + height);
            }
          }
        );

        if (hasValidElements && minX !== Infinity) {
          const contentWidth = maxX - minX;
          const contentHeight = maxY - minY;

          const viewportSize = 512;
          const padding = 80;
          const availableWidth = viewportSize - padding;
          const availableHeight = viewportSize - padding;

          if (
            contentWidth > availableWidth ||
            contentHeight > availableHeight
          ) {
            const scaleX = availableWidth / contentWidth;
            const scaleY = availableHeight / contentHeight;
            const optimalZoom = Math.min(scaleX, scaleY, 0.8);

            api.updateScene({
              appState: {
                zoom: {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  value: optimalZoom as any,
                },
              },
            });
          }
        }

        setTimeout(() => {
          api.scrollToContent();
        }, 50);
      } catch (error) {
        console.warn("Auto-fit calculation failed:", error);
      }
    },
    []
  );

  // TODO: remove the useEffect and plug the update function into the change function
  React.useEffect(() => {
    if (excalidrawApi) {
      const sceneData = tool.configuration.generateFunction(configuration);
      excalidrawApi.updateScene(sceneData);

      if (
        sceneData.elements &&
        Array.isArray(sceneData.elements) &&
        sceneData.elements.length > 0
      ) {
        setTimeout(() => {
          excalidrawApi.scrollToContent();

          autoFitContent(sceneData.elements, excalidrawApi);

          setTimeout(() => {
            excalidrawApi.scrollToContent();

            setTimeout(() => {
              excalidrawApi.scrollToContent();
            }, 100);
          }, 150);
        }, 100);
      }
    }
  }, [excalidrawApi, configuration, tool.configuration, autoFitContent]);

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
              <Flex direction="column" gap="4">
                <HistoryPanel
                  history={history}
                  onLoadFromHistory={loadFromHistory}
                  onDeleteFromHistory={deleteFromHistory}
                  onClearHistory={clearHistory}
                  onResetConfiguration={resetConfiguration}
                />

                <tool.component
                  configuration={configuration}
                  onConfigurationChange={updateConfiguration}
                />

                <Button
                  size="3"
                  variant="classic"
                  onClick={generateAndCopy}
                  loading={isLoading}
                  className="!cursor-pointer"
                >
                  📝 Generate & Copy
                </Button>

                <StatusDisplay status={status} onClose={closeStatus} />

                <Box>
                  <Heading size={"5"} mb={"3"}>
                    Preview
                  </Heading>
                  <Card>
                    <Box className="!w-full !aspect-square overflow-hidden excalidraw-preview">
                      <Excalidraw
                        theme={appearance}
                        excalidrawAPI={(api) => setExcalidrawApi(api)}
                        initialData={tool.configuration.generateFunction(
                          configuration
                        )}
                        viewModeEnabled
                        zenModeEnabled
                        gridModeEnabled={false}
                        detectScroll={false}
                        handleKeyboardGlobally={false}
                        UIOptions={{
                          canvasActions: {
                            changeViewBackgroundColor: false,
                            clearCanvas: false,
                            export: false,
                            loadScene: false,
                            saveToActiveFile: false,
                            toggleTheme: false,
                            saveAsImage: false,
                          },
                        }}
                      />
                    </Box>
                  </Card>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </MaxWidthBox>
    </Box>
  );
};
