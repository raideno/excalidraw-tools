import { TableIcon } from "@radix-ui/react-icons";

import type { Tool } from "@/tools";

import { generateTableData } from "@/tools/table/helpers";
import { TableToolControls } from "@/tools/table/controls";

export interface TableConfiguration extends Record<string, unknown> {
  rows: number;
  cols: number;
  cellWidth: number;
  cellHeight: number;
  hasHeaderRow: boolean;
  hasPrimaryColumn: boolean;
  hasStripes: boolean;
}

export const TableTool: Tool<TableConfiguration> = {
  configuration: {
    defaultConfiguration: {
      rows: 5,
      cols: 4,
      cellWidth: 120,
      cellHeight: 60,
      hasHeaderRow: true,
      hasPrimaryColumn: false,
      hasStripes: false,
    },
    generateFunction: generateTableData,
    getHistoryName: (config) =>
      `${config.rows}x${config.cols} Table${
        config.hasHeaderRow ? " (Header)" : ""
      }${config.hasPrimaryColumn ? " (Primary)" : ""}${
        config.hasStripes ? " (Striped)" : ""
      }`,
    version: 1,
  },
  icon: <TableIcon width={24} height={24} />,
  name: "Table Tool",
  description: "Create and manage tables in Excalidraw.",
  component: TableToolControls,
  path: "/table",
  category: "Data Visualization",
};
