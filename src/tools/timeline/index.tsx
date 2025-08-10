import React from "react";

import { CopyIcon, Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Text, IconButton, Grid } from "@radix-ui/themes";

import { cn } from "@/lib/utils";
import { useToolPersistence } from "@/lib/use-tool-persistence";

import {
  ONE_LINE_EXAMPLE,
  MULTI_LINES_EXAMPLE,
} from "@/tools/timeline/examples";
import { generateTimelineData } from "@/tools/timeline/helpers";
import type { TimelineConfiguration, Span } from "@/tools/timeline/helpers";

import { SelectField } from "@/components/ui/select-field";
import { NumberInputField } from "@/components/ui/number-input-field";
import { HistoryPanel } from "@/components/misc/history-panel";

const DEFAULT_TIMELINE_CONFIGURATION: TimelineConfiguration = {
  ticks: "transition",
  spans: [],
};

interface Status {
  type: "success" | "error" | null;
  message: string;
  data?: string;
}

export interface TimelineToolProps {
  defaultConfiguration?: TimelineConfiguration;
}

export const TimelineTool: React.FC<TimelineToolProps> = ({
  defaultConfiguration = DEFAULT_TIMELINE_CONFIGURATION,
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
    toolName: "timeline",
    defaultConfiguration: defaultConfiguration,
    maxHistoryItems: 15,
  });

  const [status, setStatus] = React.useState<Status>({
    type: null,
    message: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const updateConfig = <K extends keyof TimelineConfiguration>(
    key: K,
    value: TimelineConfiguration[K]
  ) => {
    updateConfiguration(key, value);
  };

  const updateSpan = <K extends keyof Span>(
    index: number,
    key: K,
    value: Span[K]
  ) => {
    const newSpans = [...configuration.spans];
    newSpans[index][key] = value;
    updateConfiguration("spans", newSpans);
  };

  const addSpan = () => {
    const newSpan: Span = {
      start: 0,
      end: 5,
      line: 1,
    };
    updateConfiguration("spans", [...configuration.spans, newSpan]);
  };

  const removeSpan = (index: number) => {
    const newSpans = configuration.spans.filter((_, i) => i !== index);
    updateConfiguration("spans", newSpans);
  };

  const loadExample = (exampleSpans: Span[]) => {
    updateConfiguration("spans", [...exampleSpans]);
  };

  const generateAndCopyTimeline = async () => {
    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const json = generateTimelineData(configuration);
      const jsonString = JSON.stringify(json, null, 2);

      await navigator.clipboard.writeText(jsonString);

      // Add to history with a descriptive name
      const historyName = `Timeline (${configuration.spans.length} spans, ${configuration.ticks} ticks)`;
      addToHistory(configuration, historyName);

      setStatus({
        type: "success",
        message:
          "✅ Timeline copied to clipboard! Go to excalidraw.com and press Ctrl+V to paste.",
      });
    } catch (error) {
      console.error("[error]: failed auto copy.", error);
      const json = generateTimelineData(configuration);
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
          message: "✅ Timeline data copied to clipboard!",
        });
      } catch (error) {
        console.error("[error]: failed to copy manually.", error);
      }
    }
  };

  return (
    <Box>
      <Flex direction="column" gap="4">
        <HistoryPanel
          history={history}
          onLoadFromHistory={loadFromHistory}
          onDeleteFromHistory={deleteFromHistory}
          onClearHistory={clearHistory}
          onResetConfiguration={resetConfiguration}
        />

        <Box>
          <Text size="2" weight="bold" mb="2">
            Examples
          </Text>
          <Flex gap="2">
            <Button
              variant="soft"
              size="1"
              onClick={() => loadExample(ONE_LINE_EXAMPLE)}
              className="!cursor-pointer"
            >
              📊 Single Line
            </Button>
            <Button
              variant="soft"
              size="1"
              onClick={() => loadExample(MULTI_LINES_EXAMPLE)}
              className="!cursor-pointer"
            >
              📈 Multi Lines
            </Button>
          </Flex>
        </Box>

        <SelectField
          label="Time Ticks"
          value={configuration.ticks}
          options={[
            { value: "none", label: "None" },
            { value: "all", label: "At Every Tick" },
            { value: "transition", label: "At Transition" },
          ]}
          onChange={(value) =>
            updateConfig("ticks", value as "none" | "transition" | "all")
          }
        />

        <Flex direction="column" gap="3">
          {configuration.spans.map((span, index) => (
            <Box
              key={index}
              p="3"
              style={{
                border: `1px solid var(--gray-a5)`,
                borderRadius: "var(--radius-3)",
              }}
            >
              <Flex direction="column" gap="3">
                <Flex justify="between" align="center">
                  <Text size="2" weight="bold">
                    Span #{index + 1}
                  </Text>
                  <IconButton
                    size="1"
                    color="red"
                    variant="soft"
                    onClick={() => removeSpan(index)}
                    className="!cursor-pointer"
                  >
                    <Cross1Icon />
                  </IconButton>
                </Flex>

                <Grid columns="3" gap="3">
                  <NumberInputField
                    label="Start"
                    value={span.start}
                    min={0}
                    onChange={(v) => updateSpan(index, "start", v)}
                  />
                  <NumberInputField
                    label="End"
                    value={span.end}
                    min={span.start}
                    onChange={(v) => updateSpan(index, "end", v)}
                  />
                  <NumberInputField
                    label="Line"
                    value={span.line}
                    min={1}
                    onChange={(v) => updateSpan(index, "line", v)}
                  />
                </Grid>
              </Flex>
            </Box>
          ))}
        </Flex>

        <Button variant="soft" onClick={addSpan} className="!cursor-pointer">
          <PlusIcon /> Add Span
        </Button>

        <Button
          size="3"
          variant="classic"
          onClick={generateAndCopyTimeline}
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
            {status.data && (
              <Box mt="2">
                <Button
                  color="gray"
                  size="1"
                  variant="soft"
                  className="!w-full !cursor-pointer !mb-2"
                  onClick={copyManually}
                >
                  <CopyIcon />
                  <Text>Copy Data</Text>
                </Button>
                <Box
                  p="2"
                  className={cn(
                    "font-mono text-xs",
                    "overflow-auto max-h-32",
                    "bg-[var(--gray-3)] rounded-[var(--radius-1)]"
                  )}
                >
                  <pre>{status.data}</pre>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Flex>
    </Box>
  );
};
