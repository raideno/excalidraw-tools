import { ValueIcon } from "@radix-ui/react-icons";

import type { Tool } from "@/tools";

import { generateProgressData } from "@/tools/progress/helpers";
import { ProgressToolControls } from "@/tools/progress/controls";

export interface ProgressConfiguration extends Record<string, unknown> {
  width: number;
  height: number;
  progress: number;
  showProgressTick: boolean;
  showEndTicks: boolean;
}

export const ProgressTool: Tool<ProgressConfiguration> = {
  configuration: {
    defaultConfiguration: {
      width: 400,
      height: 24,
      progress: 50,
      showProgressTick: true,
      showEndTicks: false,
    },
    generateFunction: generateProgressData,
    getHistoryName: (config) =>
      `Progress ${config.progress}% (${config.width}×${config.height})${
        config.showProgressTick ? " +Tick" : ""
      }${config.showEndTicks ? " +EndTicks" : ""}`,
    version: 1,
  },
  icon: <ValueIcon width={24} height={24} />,
  name: "Progress Tool",
  description: "Generate a simple progress bar JSON for Excalidraw.",
  component: ProgressToolControls,
  path: "/progress",
  category: "UI Components",
};
