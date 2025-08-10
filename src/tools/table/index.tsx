import React from "react";

import { CopyIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Text, IconButton } from "@radix-ui/themes";

import { cn } from "@/lib/utils";
import { useToolPersistence } from "@/lib/use-tool-persistence";

import { generateTableData } from "@/tools/table/helpers";
import type { TableConfiguration } from "@/tools/table/helpers";

import { NumberInputField } from "@/components/ui/number-input-field";
import { SwitchField } from "@/components/ui/switch-field";
import { HistoryPanel } from "@/components/misc/history-panel";

const DEFAULT_CONFIGURATION: TableConfiguration = {
  rows: 5,
  cols: 4,
  cellWidth: 120,
  cellHeight: 60,
  hasHeaderRow: true,
  hasPrimaryColumn: false,
  hasStripes: false,
};

interface Status {
  type: "success" | "error" | null;
  message: string;
  data?: string;
}

export type TableToolProps = {
  defaultConfiguration?: TableConfiguration;
};

export const TableTool: React.FC<TableToolProps> = ({
  defaultConfiguration = DEFAULT_CONFIGURATION,
}) => {
  const {
    configuration,
    updateConfiguration,
    history,
    addToHistory,
    loadFromHistory,
    deleteFromHistory,
    clearHistory,
    resetConfiguration,
  } = useToolPersistence({
    toolName: "table",
    defaultConfiguration: defaultConfiguration,
    maxHistoryItems: 15,
    versionInfo: {
      currentVersion: 1,
      // migrations: {
      //   2: (config) => {
      //     // Example migration from version 1 to 2
      //     return { ...config, newField: "defaultValue" };
      //   }
      // }
    },
  });

  const [status, setStatus] = React.useState<Status>({
    type: null,
    message: "",
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const updateConfig = (
    key: keyof TableConfiguration,
    value: number | boolean
  ) => {
    updateConfiguration(key, value);
  };

  const generateAndCopyTable = async () => {
    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const json = generateTableData(configuration);
      const jsonString = JSON.stringify(json, null, 2);

      await navigator.clipboard.writeText(jsonString);

      // Add to history with a descriptive name
      const historyName = `${configuration.rows}×${configuration.cols} Table${
        configuration.hasHeaderRow ? " (Header)" : ""
      }${configuration.hasPrimaryColumn ? " (Primary)" : ""}${
        configuration.hasStripes ? " (Striped)" : ""
      }`;
      
      addToHistory(configuration, historyName);

      setStatus({
        type: "success",
        message:
          "✅ Table copied to clipboard! Go to excalidraw.com and press Ctrl+V to paste.",
      });
    } catch (error) {
      console.error("[error]: failed auto copy.", error);

      const json = generateTableData(configuration);
      const jsonString = JSON.stringify(json, null, 2);

      setStatus({
        type: "error",
        message:
          "❌ Failed to copy to clipboard. You can copy the data manually below:",
        data: jsonString,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeStatus = () => {
    setStatus({ type: null, message: "" });
  };

  const copyManually = async () => {
    if (status.data) {
      try {
        await navigator.clipboard.writeText(status.data);
        setStatus({
          type: "success",
          message: "✅ Table data copied to clipboard!",
        });
      } catch (error) {
        console.error("[error]: failed to copy manually.", error);
      }
    }
  };

  return (
    <Box>
      <Flex direction="column" gap="3">
        <HistoryPanel
          history={history}
          onLoadFromHistory={loadFromHistory}
          onDeleteFromHistory={deleteFromHistory}
          onClearHistory={clearHistory}
          onResetConfiguration={resetConfiguration}
        />

        <Flex gap="4">
          <NumberInputField
            label="Rows"
            value={configuration.rows}
            min={1}
            onChange={(v) => updateConfig("rows", v)}
            onIncrement={() => updateConfig("rows", configuration.rows + 1)}
            onDecrement={() =>
              configuration.rows > 1 &&
              updateConfig("rows", configuration.rows - 1)
            }
          />
          <NumberInputField
            label="Columns"
            value={configuration.cols}
            min={1}
            onChange={(v) => updateConfig("cols", v)}
            onIncrement={() => updateConfig("cols", configuration.cols + 1)}
            onDecrement={() =>
              configuration.cols > 1 &&
              updateConfig("cols", configuration.cols - 1)
            }
          />
        </Flex>

        <Flex gap="4">
          <NumberInputField
            label="Cell Width"
            value={configuration.cellWidth}
            min={1}
            onChange={(v) => updateConfig("cellWidth", v)}
            onIncrement={() =>
              updateConfig("cellWidth", configuration.cellWidth + 1)
            }
            onDecrement={() =>
              updateConfig("cellWidth", configuration.cellWidth - 1)
            }
          />
          <NumberInputField
            label="Cell Height"
            value={configuration.cellHeight}
            min={1}
            onChange={(v) => updateConfig("cellHeight", v)}
            onIncrement={() =>
              updateConfig("cellHeight", configuration.cellHeight + 1)
            }
            onDecrement={() =>
              updateConfig("cellHeight", configuration.cellHeight - 1)
            }
          />
        </Flex>

        <SwitchField
          label="Header Row"
          description="Include a header row at the top of the table."
          checked={configuration.hasHeaderRow}
          onCheckedChange={(checked) => updateConfig("hasHeaderRow", checked)}
        />

        <SwitchField
          label="Primary Column"
          description="Include a primary column row at the left of the table."
          checked={configuration.hasPrimaryColumn}
          onCheckedChange={(checked) =>
            updateConfig("hasPrimaryColumn", checked)
          }
        />

        <SwitchField
          label="Stripes"
          description="Alternate row colors for better readability."
          checked={configuration.hasStripes}
          onCheckedChange={(checked) => updateConfig("hasStripes", checked)}
        />

        <Button
          size="3"
          variant="classic"
          onClick={generateAndCopyTable}
          loading={isLoading}
          className="!cursor-pointer"
        >
          📝 Generate & Copy
        </Button>

        {status.type && (
          <Box
            p="3"
            className={cn(
              "rounded-[var(--radius-2)] border border-solid",
              status.type === "success" &&
                "bg-[var(--green-2)] border-[var(--green-8)]",
              status.type === "error" &&
                "bg-[var(--red-2)] border-[var(--red-8)]"
            )}
          >
            <Flex justify="between" align="center" gap="2">
              <Text size="2">{status.message}</Text>
              <IconButton
                size="1"
                color="gray"
                variant="ghost"
                onClick={closeStatus}
                className="!cursor-pointer"
              >
                <Cross1Icon />
              </IconButton>
            </Flex>
            <Box>
              {status.data && (
                <Box mt="2">
                  <Flex align="center" gap="2" mb="2">
                    <Button
                      color="gray"
                      size="1"
                      variant="soft"
                      className="!w-full !cursor-pointer"
                      onClick={copyManually}
                    >
                      <CopyIcon />
                      <Text>Copy Data</Text>
                    </Button>
                  </Flex>
                  <Box
                    p="2"
                    className={cn(
                      "font-mono text-xs",
                      "overflow-auto max-h-32",
                      "bg-[var(--gray-3)] rounded-[var(--radius-1)]",
                      "text-xs"
                    )}
                  >
                    <pre>{status.data}</pre>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Flex>
    </Box>
  );
};
