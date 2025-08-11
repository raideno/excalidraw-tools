// TODO: make it auto import tools using some vite plugin rather than having to manually import them.

import { TableTool } from "@/tools/table/configuration";
import { TimelineTool } from "@/tools/timeline/configuration";
import { SkeletonTool } from "@/tools/skeleton/configuration";
import { ProgressTool } from "@/tools/progress/configuration";

export interface ToolConfiguration<T extends Record<string, unknown>> {
  defaultConfiguration: T;
  generateFunction: (config: T) => Record<string, unknown>;
  getHistoryName?: (config: T) => string;
  version?: number;
}

export interface ToolComponentProps<T extends Record<string, unknown>> {
  configuration: T;
  onConfigurationChange: (key: keyof T, value: T[keyof T]) => void;
}

export interface Tool<T extends Record<string, unknown>> {
  name: string;
  description: string;
  component: React.FC<ToolComponentProps<T>>;
  configuration: ToolConfiguration<T>;
  experimental?: boolean;
  path: string;
  icon?: React.ReactNode;
  category: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tools: Array<Tool<any>> = [
  TableTool,
  ProgressTool,
  TimelineTool,
  SkeletonTool,
] as const;
