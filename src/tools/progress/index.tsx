import React from "react";
import { CopyIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Text, IconButton } from "@radix-ui/themes";
import { cn } from "@/lib/utils";
import { NumberInputField } from "@/components/ui/number-input-field";
import { SwitchField } from "@/components/ui/switch-field";
import type { ProgressConfiguration } from "@/tools/progress/helpers";
import { generateProgressData } from "@/tools/progress/helpers";

const DEFAULT_CONFIGURATION: ProgressConfiguration = {
  width: 400,
  height: 24,
  progress: 50,
  showProgressTick: true,
  showEndTicks: false,
};

interface Status {
  type: "success" | "error" | null;
  message: string;
  data?: string;
}

export type ProgressToolProps = {
  defaultConfiguration?: ProgressConfiguration;
};

export const ProgressTool: React.FC<ProgressToolProps> = ({
  defaultConfiguration = DEFAULT_CONFIGURATION,
}) => {
  const [configuration, setConfiguration] =
    React.useState<ProgressConfiguration>(defaultConfiguration);

  const [status, setStatus] = React.useState<Status>({
    type: null,
    message: "",
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const updateConfig = (
    key: keyof ProgressConfiguration,
    value: number | boolean
  ) => {
    setConfiguration((prev) => ({ ...prev, [key]: value }));
  };

  const generateAndCopy = async () => {
    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const json = generateProgressData(configuration);
      const jsonString = JSON.stringify(json, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setStatus({
        type: "success",
        message:
          "✅ Progress bar copied! Go to excalidraw.com and press Ctrl+V to paste.",
      });
    } catch (error) {
      console.error("[error]: failed auto copy.", error);
      const json = generateProgressData(configuration);
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
          message: "✅ Progress bar data copied to clipboard!",
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
          <NumberInputField
            label="Bar width"
            value={configuration.width}
            min={10}
            onChange={(v) => updateConfig("width", v)}
            onIncrement={() => updateConfig("width", configuration.width + 10)}
            onDecrement={() =>
              updateConfig("width", Math.max(10, configuration.width - 10))
            }
          />
          <NumberInputField
            label="Bar height"
            value={configuration.height}
            min={4}
            onChange={(v) => updateConfig("height", v)}
            onIncrement={() => updateConfig("height", configuration.height + 2)}
            onDecrement={() =>
              updateConfig("height", Math.max(4, configuration.height - 2))
            }
          />
        </Flex>

        <NumberInputField
          label="Progress (%)"
          value={configuration.progress}
          min={0}
          onChange={(v) =>
            updateConfig("progress", Math.max(0, Math.min(100, v)))
          }
          onIncrement={() =>
            updateConfig(
              "progress",
              Math.max(0, Math.min(100, configuration.progress + 5))
            )
          }
          onDecrement={() =>
            updateConfig(
              "progress",
              Math.max(0, Math.min(100, configuration.progress - 5))
            )
          }
        />

        <SwitchField
          label="Progress tick"
          description="Draw a vertical tick at the current progress."
          checked={configuration.showProgressTick}
          onCheckedChange={(checked) =>
            updateConfig("showProgressTick", checked)
          }
        />

        <SwitchField
          label="Start/End ticks"
          description="Draw ticks at 0% and 100%."
          checked={configuration.showEndTicks}
          onCheckedChange={(checked) => updateConfig("showEndTicks", checked)}
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
