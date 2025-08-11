import { TimerIcon } from "@radix-ui/react-icons";

import type { Tool } from "@/tools";

import { TimelineToolControls } from "@/tools/timeline/controls";
import { generateTimelineData } from "@/tools/timeline/helpers";

export interface Span {
  // NOTE: integer
  start: number;
  end: number;
  line: number;
}

export interface TimelineConfiguration extends Record<string, unknown> {
  ticks: "none" | "transition" | "all";
  spans: Array<Span>;
}

export const TimelineTool: Tool<TimelineConfiguration> = {
  configuration: {
    version: 1,
    defaultConfiguration: {
      ticks: "transition",
      spans: [],
    },
    generateFunction: generateTimelineData,
    getHistoryName: (config: TimelineConfiguration) => {
      const spanCount = config.spans.length;
      const ticksLabel =
        config.ticks === "none"
          ? "No Ticks"
          : config.ticks === "transition"
          ? "Transition Ticks"
          : "All Ticks";

      if (spanCount === 0) {
        return `Timeline (Empty) - ${ticksLabel}`;
      }

      const lines = new Set(config.spans.map((span) => span.line)).size;
      return `Timeline (${spanCount} spans, ${lines} lines) - ${ticksLabel}`;
    },
  },
  icon: <TimerIcon width={24} height={24} />,
  name: "Timeline Tool",
  description: "Create and manage timelines in Excalidraw.",
  component: TimelineToolControls,
  path: "/timeline",
  category: "Data Visualization",
};
