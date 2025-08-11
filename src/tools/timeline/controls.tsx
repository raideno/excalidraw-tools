import React from "react";

import { PlusIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Text, IconButton, Grid } from "@radix-ui/themes";

import { SelectField } from "@/components/ui/select-field";
import { NumberInputField } from "@/components/ui/number-input-field";

import type { ToolComponentProps } from "@/tools";

import {
  ONE_LINE_EXAMPLE,
  MULTI_LINES_EXAMPLE,
} from "@/tools/timeline/examples";
import type {
  Span,
  TimelineConfiguration,
} from "@/tools/timeline/configuration";

export const TimelineToolControls: React.FC<
  ToolComponentProps<TimelineConfiguration>
> = ({ configuration: config, onConfigurationChange }) => {
  const updateSpan = <K extends keyof Span>(
    index: number,
    key: K,
    value: Span[K]
  ) => {
    const newSpans = [...config.spans];
    newSpans[index][key] = value;
    onConfigurationChange("spans", newSpans);
  };

  const addSpan = () => {
    const newSpan: Span = {
      start: 0,
      end: 5,
      line: 1,
    };
    onConfigurationChange("spans", [...config.spans, newSpan]);
  };

  const removeSpan = (index: number) => {
    const newSpans = config.spans.filter((_, i) => i !== index);
    onConfigurationChange("spans", newSpans);
  };

  const loadExample = (exampleSpans: Span[]) => {
    onConfigurationChange("spans", [...exampleSpans]);
  };

  console.log("[config]:", config);

  return (
    <div className="space-y-6">
      {/* Ticks Configuration */}
      <Box>
        <SelectField
          label="Ticks"
          value={config.ticks}
          onChange={(ticks) =>
            onConfigurationChange(
              "ticks",
              ticks as "none" | "transition" | "all"
            )
          }
          options={[
            { value: "none", label: "None" },
            { value: "transition", label: "Transition" },
            { value: "all", label: "All" },
          ]}
        />
      </Box>

      {/* Examples */}
      <Box>
        <Text as="label" size="2" weight="medium" className="mb-2 block">
          Examples
        </Text>
        <Flex gap="2">
          <Button
            variant="outline"
            size="1"
            onClick={() => loadExample(ONE_LINE_EXAMPLE)}
          >
            One Line
          </Button>
          <Button
            variant="outline"
            size="1"
            onClick={() => loadExample(MULTI_LINES_EXAMPLE)}
          >
            Multi Lines
          </Button>
        </Flex>
      </Box>

      {/* Spans Configuration */}
      <Box>
        <Flex justify="between" align="center" className="mb-3">
          <Text as="label" size="2" weight="medium">
            Spans ({config.spans.length})
          </Text>
          <Button variant="outline" size="1" onClick={addSpan}>
            <PlusIcon width={16} height={16} />
            Add Span
          </Button>
        </Flex>

        <div className="space-y-3">
          {config.spans.map((span, index) => (
            <Box
              key={index}
              className="p-3 border border-gray-200 rounded-md dark:border-gray-700"
            >
              <Flex justify="between" align="center" className="mb-2">
                <Text size="1" weight="medium">
                  Span {index + 1}
                </Text>
                <IconButton
                  variant="ghost"
                  size="1"
                  color="red"
                  onClick={() => removeSpan(index)}
                >
                  <Cross1Icon width={12} height={12} />
                </IconButton>
              </Flex>
              <Grid columns="3" gap="2">
                <NumberInputField
                  label="Start"
                  value={span.start}
                  onChange={(start) => updateSpan(index, "start", start)}
                />
                <NumberInputField
                  label="End"
                  value={span.end}
                  onChange={(end) => updateSpan(index, "end", end)}
                />
                <NumberInputField
                  label="Line"
                  value={span.line}
                  onChange={(line) => updateSpan(index, "line", line)}
                />
              </Grid>
            </Box>
          ))}
        </div>

        {config.spans.length === 0 && (
          <Box className="text-center py-8 text-gray-500">
            <Text size="2">
              No spans configured. Add a span to get started.
            </Text>
          </Box>
        )}
      </Box>
    </div>
  );
};
