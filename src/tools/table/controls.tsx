import React from "react";

import { Box, Flex } from "@radix-ui/themes";

import { SwitchField } from "@/components/ui/switch-field";
import { NumberInputField } from "@/components/ui/number-input-field";

import type { ToolComponentProps } from "@/tools";

import type { TableConfiguration } from "@/tools/table/configuration";

export const TableToolControls: React.FC<
  ToolComponentProps<TableConfiguration>
> = ({ configuration, onConfigurationChange }) => {
  return (
    <Box>
      <Flex direction="column" gap="3">
        <Flex gap="4">
          <NumberInputField
            label="Rows"
            value={configuration.rows}
            min={1}
            onChange={(v) => onConfigurationChange("rows", v)}
            onIncrement={() =>
              onConfigurationChange("rows", configuration.rows + 1)
            }
            onDecrement={() =>
              configuration.rows > 1 &&
              onConfigurationChange("rows", configuration.rows - 1)
            }
          />
          <NumberInputField
            label="Columns"
            value={configuration.cols}
            min={1}
            onChange={(v) => onConfigurationChange("cols", v)}
            onIncrement={() =>
              onConfigurationChange("cols", configuration.cols + 1)
            }
            onDecrement={() =>
              configuration.cols > 1 &&
              onConfigurationChange("cols", configuration.cols - 1)
            }
          />
        </Flex>

        <Flex gap="4">
          <NumberInputField
            label="Cell Width"
            value={configuration.cellWidth}
            min={1}
            onChange={(v) => onConfigurationChange("cellWidth", v)}
            onIncrement={() =>
              onConfigurationChange("cellWidth", configuration.cellWidth + 1)
            }
            onDecrement={() =>
              onConfigurationChange("cellWidth", configuration.cellWidth - 1)
            }
          />
          <NumberInputField
            label="Cell Height"
            value={configuration.cellHeight}
            min={1}
            onChange={(v) => onConfigurationChange("cellHeight", v)}
            onIncrement={() =>
              onConfigurationChange("cellHeight", configuration.cellHeight + 1)
            }
            onDecrement={() =>
              onConfigurationChange("cellHeight", configuration.cellHeight - 1)
            }
          />
        </Flex>

        <SwitchField
          label="Header Row"
          description="Include a header row at the top of the table."
          checked={configuration.hasHeaderRow}
          onCheckedChange={(checked) =>
            onConfigurationChange("hasHeaderRow", checked)
          }
        />

        <SwitchField
          label="Primary Column"
          description="Include a primary column row at the left of the table."
          checked={configuration.hasPrimaryColumn}
          onCheckedChange={(checked) =>
            onConfigurationChange("hasPrimaryColumn", checked)
          }
        />

        <SwitchField
          label="Stripes"
          description="Alternate row colors for better readability."
          checked={configuration.hasStripes}
          onCheckedChange={(checked) =>
            onConfigurationChange("hasStripes", checked)
          }
        />
      </Flex>
    </Box>
  );
};
