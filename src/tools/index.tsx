// TODO: make it auto import tools using some vite plugin rather than having to manually import them.

import { TableTool } from "@/tools/table";
import { TimelineTool } from "@/tools/timeline";
import { SkeletonTool } from "@/tools/skeleton";
import { ProgressTool } from "@/tools/progress";

export interface Tool {
  name: string;
  description: string;
  component: React.FC;
  experimental?: boolean;
}

export const tools: Array<Tool> = [
  {
    name: "Table Tool",
    description: "Create and manage tables in Excalidraw.",
    component: TableTool,
  },
  {
    name: "Progress Tool",
    description: "Generate a simple progress bar JSON for Excalidraw.",
    component: ProgressTool,
  },
  {
    name: "Timeline Tool",
    description: "Create and manage timelines in Excalidraw.",
    component: TimelineTool,
  },
  {
    name: "Skeleton Tool",
    description: "Create and visualize 3D skeleton poses with kinematic trees.",
    component: SkeletonTool,
    experimental: true,
  },
];
