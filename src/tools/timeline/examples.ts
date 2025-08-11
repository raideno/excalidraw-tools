import type { Span } from "@/tools/timeline/configuration";

export const ONE_LINE_EXAMPLE: Span[] = [
  {
    start: 0,
    end: 3,
    line: 1,
  },
  {
    start: 3,
    end: 10,
    line: 1,
  },
  {
    start: 10,
    end: 14,
    line: 1,
  },
  {
    start: 14,
    end: 20,
    line: 1,
  },
  {
    start: 20,
    end: 24,
    line: 1,
  },
];

export const MULTI_LINES_EXAMPLE: Span[] = [
  {
    start: 0,
    end: 5,
    line: 3,
  },
  {
    start: 5,
    end: 10,
    line: 1,
  },
  {
    start: 10,
    end: 14,
    line: 2,
  },
  {
    start: 14,
    end: 20,
    line: 1,
  },
  {
    start: 20,
    end: 24,
    line: 3,
  },
  {
    start: 14,
    end: 22,
    line: 4,
  },
];
