import { BoxModelIcon } from "@radix-ui/react-icons";

import type { Tool } from "@/tools";

import {
  generateSkeletonData,
  KINEMATIC_TREES,
} from "@/tools/skeleton/helpers";
import { SkeletonToolControls } from "@/tools/skeleton/controls";

export interface SkeletonConfig extends Record<string, unknown> {
  kinematicTree: keyof typeof KINEMATIC_TREES;
  showJointNumbers: boolean;
  csvData?: string;
  jointSize: number;
  scale: number;
}

export const SkeletonTool: Tool<SkeletonConfig> = {
  configuration: {
    version: 1,
    defaultConfiguration: {
      kinematicTree: "smpljoints",
      showJointNumbers: false,
      jointSize: 10,
      scale: 1,
    },
    generateFunction: generateSkeletonData,
    getHistoryName: (config: SkeletonConfig) =>
      `Skeleton (${config.kinematicTree}) JS:${config.jointSize} Scale:${
        config.scale
      }${config.showJointNumbers ? " +Numbers" : ""}${
        config.csvData ? " +CSV" : ""
      }`,
  },
  icon: <BoxModelIcon width={24} height={24} />,
  name: "Skeleton Tool",
  description: "Create and visualize 3D skeleton poses with kinematic trees.",
  component: SkeletonToolControls,
  experimental: true,
  path: "/skeleton",
  category: "3D Graphics",
};
