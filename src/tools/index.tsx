import { TableTool } from "@/tools/table";

export interface Tool {
  name: string;
  description: string;
  component: React.FC;
}

export const tools: Array<Tool> = [
  {
    name: "Table Tool",
    description: "Create and manage tables in Excalidraw.",
    component: TableTool,
  },
];
