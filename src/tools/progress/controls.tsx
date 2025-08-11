import React from "react";

import { Box, Flex } from "@radix-ui/themes";

import { SwitchField } from "@/components/ui/switch-field";
import { NumberInputField } from "@/components/ui/number-input-field";

import type { ToolComponentProps } from "@/tools";
import type { ProgressConfiguration } from "@/tools/progress/configuration";

export const ProgressToolControls: React.FC<
  ToolComponentProps<ProgressConfiguration>
> = ({ configuration, onConfigurationChange }) => {
  return (
    <Box>
      <Flex direction="column" gap="3">
        <Flex gap="4">
          <NumberInputField
            label="Bar width"
            value={configuration.width}
            min={10}
            onChange={(v) => onConfigurationChange("width", v)}
            onIncrement={() =>
              onConfigurationChange("width", configuration.width + 10)
            }
            onDecrement={() =>
              onConfigurationChange(
                "width",
                Math.max(10, configuration.width - 10)
              )
            }
          />
          <NumberInputField
            label="Bar height"
            value={configuration.height}
            min={4}
            onChange={(v) => onConfigurationChange("height", v)}
            onIncrement={() =>
              onConfigurationChange("height", configuration.height + 2)
            }
            onDecrement={() =>
              onConfigurationChange(
                "height",
                Math.max(4, configuration.height - 2)
              )
            }
          />
        </Flex>

        <NumberInputField
          label="Progress (%)"
          value={configuration.progress}
          min={0}
          onChange={(v) =>
            onConfigurationChange("progress", Math.max(0, Math.min(100, v)))
          }
          onIncrement={() =>
            onConfigurationChange(
              "progress",
              Math.max(0, Math.min(100, configuration.progress + 5))
            )
          }
          onDecrement={() =>
            onConfigurationChange(
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
            onConfigurationChange("showProgressTick", checked)
          }
        />

        <SwitchField
          label="End ticks"
          description="Draw vertical ticks at the start and end of the progress bar."
          checked={configuration.showEndTicks}
          onCheckedChange={(checked) =>
            onConfigurationChange("showEndTicks", checked)
          }
        />
      </Flex>
    </Box>
  );
};
