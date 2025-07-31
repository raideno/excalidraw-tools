import React from "react";

import {
  Box,
  Button,
  Flex,
  Text,
  TextField,
  Switch,
  IconButton,
} from "@radix-ui/themes";
import { CopyIcon, Cross1Icon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";

import { generateTableData } from "@/tools/table/helpers";
import type { TableConfiguration } from "@/tools/table/helpers";

export type TableToolProps = {
  defaultConfiguration?: TableConfiguration;
};

const DEFAULT_CONFIGURATION: TableConfiguration = {
  rows: 5,
  cols: 4,
  cellWidth: 120,
  cellHeight: 60,
  hasHeaderRow: true,
  hasPrimaryColumn: false,
};

interface Status {
  type: "success" | "error" | null;
  message: string;
  data?: string;
}

export const TableTool: React.FC<TableToolProps> = ({
  defaultConfiguration = DEFAULT_CONFIGURATION,
}) => {
  const [configuration, setConfiguration] =
    React.useState<TableConfiguration>(defaultConfiguration);

  const [status, setStatus] = React.useState<Status>({
    type: null,
    message: "",
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const updateConfig = (
    key: keyof TableConfiguration,
    value: number | boolean
  ) => {
    setConfiguration((prev) => ({ ...prev, [key]: value }));
  };

  const generateAndCopyTable = async () => {
    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const json = generateTableData(configuration);
      const jsonString = JSON.stringify(json, null, 2);

      await navigator.clipboard.writeText(jsonString);

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
        <Flex gap="4">
          <Box className="w-full">
            <Text as="label" size="2" weight="medium">
              Rows
            </Text>
            <TextField.Root
              type="number"
              value={configuration.rows.toString()}
              onChange={(e) =>
                updateConfig("rows", Math.max(1, parseInt(e.target.value) || 1))
              }
              min="1"
              size="2"
            />
          </Box>

          <Box className="w-full">
            <Text as="label" size="2" weight="medium">
              Columns
            </Text>
            <TextField.Root
              type="number"
              value={configuration.cols.toString()}
              onChange={(e) =>
                updateConfig("cols", Math.max(1, parseInt(e.target.value) || 1))
              }
              min="1"
              size="2"
            />
          </Box>
        </Flex>

        <Flex gap="4">
          <Box className="w-full">
            <Text as="label" size="2" weight="medium">
              Cell Width
            </Text>
            <TextField.Root
              type="number"
              value={configuration.cellWidth.toString()}
              onChange={(e) =>
                updateConfig("cellWidth", parseInt(e.target.value) || 120)
              }
              size="2"
            />
          </Box>

          <Box className="w-full">
            <Text as="label" size="2" weight="medium">
              Cell Height
            </Text>
            <TextField.Root
              type="number"
              value={configuration.cellHeight.toString()}
              onChange={(e) =>
                updateConfig("cellHeight", parseInt(e.target.value) || 60)
              }
              size="2"
            />
          </Box>
        </Flex>

        <Box>
          <Flex
            className="w-full"
            direction={"row"}
            align={"center"}
            justify={"between"}
            gap={"2"}
          >
            <Box>
              <Text as="div" size="2" weight="bold">
                Header Row
              </Text>
              <Text as="div" size={"1"} weight={"light"}>
                Include a header row at the top of the table.
              </Text>
            </Box>
            <Switch
              checked={configuration.hasHeaderRow}
              onCheckedChange={(checked) =>
                updateConfig("hasHeaderRow", checked)
              }
              size="2"
            />
          </Flex>
        </Box>

        <Box>
          <Flex
            className="w-full"
            direction={"row"}
            align={"center"}
            justify={"between"}
            gap={"2"}
          >
            <Box>
              <Text as="div" size="2" weight="bold">
                Primary Column
              </Text>
              <Text as="div" size={"1"} weight={"light"}>
                Include a primary column row at the left of the table.
              </Text>
            </Box>
            <Switch
              checked={configuration.hasPrimaryColumn}
              onCheckedChange={(checked) =>
                updateConfig("hasPrimaryColumn", checked)
              }
              size="2"
            />
          </Flex>
        </Box>

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
