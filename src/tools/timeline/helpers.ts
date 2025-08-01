import { COLOR_PALETTE } from "@excalidraw/common";

import type { Radians } from "@excalidraw/math";
import type { ExcalidrawRectangleElement } from "@excalidraw/excalidraw/element/types";

export interface Span {
  // NOTE: integer
  start: number;
  end: number;
  line: number;
}

export interface TimelineConfiguration {
  ticks: "none" | "transition" | "all";
  spans: Array<Span>;
}

const START_X = 100;
const START_Y = 150;
// NOTE: pixels per unit of time
const SCALE = 30;
const lineHeigh = 75;
const SPAN_HEIGHT = 50;
const TICK_HEIGHT = 10;
const LABEL_FONT_SIZE = 20;

const X_PADDING = 10;
const Y_PADDING = 2.5;

const DEFAULT_STROKE_COLOR = "#1e1e1e";
const DEFAULT_BACKGROUND_COLOR = "#e9ecef";

export const generateTimelineData = (
  timelineConfiguration: TimelineConfiguration
) => {
  const { spans } = timelineConfiguration;
  const elements: Array<unknown> = [];
  let idCounter = 1;

  if (spans.length === 0) {
    return {
      type: "excalidraw",
      version: 2,
      source: "timeline-generator",
      elements: [],
      appState: { viewBackgroundColor: "#ffffff", gridSize: null },
      files: {},
    };
  }

  const minTime = Math.min(...spans.map((s) => s.start));
  const maxTime = Math.max(...spans.map((s) => s.end));
  const maxLine = Math.max(...spans.map((s) => s.line));
  const timelineWidth = (maxTime - minTime) * SCALE;
  const timelineHeight = maxLine * lineHeigh;

  elements.push({
    id: `timeline-container-${idCounter++}`,
    type: "rectangle",
    x: START_X - X_PADDING,
    y: START_Y - Y_PADDING,
    width: timelineWidth + 2 * X_PADDING,
    height: timelineHeight + 2 * Y_PADDING,
    strokeColor: DEFAULT_STROKE_COLOR,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    fillStyle: "hachure",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    angle: 5.87 as Radians,
    index: null,
    roundness: { type: 3 },
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
    isDeleted: false,
    groupIds: [],
    frameId: null,
    boundElements: [],
    link: null,
    locked: false,
    updated: Date.now(),
  } as ExcalidrawRectangleElement);

  for (let i = 1; i < maxLine; i++) {
    const lineY = START_Y + i * lineHeigh;
    elements.push({
      id: `h-line-${i}-${idCounter++}`,
      type: "line",
      x: START_X,
      y: lineY,
      width: timelineWidth,
      height: 0,
      strokeColor: DEFAULT_STROKE_COLOR,
      strokeWidth: 1,
      strokeStyle: "dotted",
      points: [
        [0, 0],
        [timelineWidth, 0],
      ],
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      groupIds: [],
    });
  }

  if (timelineConfiguration.ticks !== "none") {
    let tickPositions: Array<number> = [];

    if (timelineConfiguration.ticks === "all") {
      for (let t = minTime; t <= maxTime; t++) {
        tickPositions.push(t);
      }
    } else if (timelineConfiguration.ticks === "transition") {
      const transitionPoints = new Set<number>();
      spans.forEach((span) => {
        transitionPoints.add(span.start);
        transitionPoints.add(span.end);
      });
      tickPositions = Array.from(transitionPoints).sort((a, b) => a - b);
    }

    tickPositions.forEach((t) => {
      const tickX = START_X + (t - minTime) * SCALE;
      elements.push({
        id: `tick-line-${t}-${idCounter++}`,
        type: "line",
        x: tickX,
        y: START_Y - Y_PADDING,
        width: 0,
        height: -TICK_HEIGHT,
        strokeColor: DEFAULT_STROKE_COLOR,
        strokeWidth: 1,
        points: [
          [0, 0],
          [0, -TICK_HEIGHT],
        ],
        seed: Math.floor(Math.random() * 100000),
        version: 1,
        versionNonce: Math.floor(Math.random() * 100000),
        isDeleted: false,
        groupIds: [],
      });

      elements.push({
        id: `tick-label-${t}-${idCounter++}`,
        type: "text",
        x: tickX - (t.toString().length * LABEL_FONT_SIZE) / 4,
        y: START_Y - Y_PADDING - TICK_HEIGHT - LABEL_FONT_SIZE,
        text: t.toString(),
        fontSize: LABEL_FONT_SIZE,
        // NOTE: code
        fontFamily: 5,
        strokeColor: DEFAULT_STROKE_COLOR,
        seed: Math.floor(Math.random() * 100000),
        version: 1,
        versionNonce: Math.floor(Math.random() * 100000),
        isDeleted: false,
        groupIds: [],
      });
    });
  }

  spans.forEach((span) => {
    const spanX = START_X + (span.start - minTime) * SCALE;
    const spanY =
      START_Y + (span.line - 1) * lineHeigh + (lineHeigh - SPAN_HEIGHT) / 2;
    const spanWidth = (span.end - span.start) * SCALE;

    const rectId = `span-rect-${idCounter++}`;
    const textId = `span-text-${idCounter++}`;
    const groupId = `span-group-${idCounter++}`;

    elements.push({
      id: rectId,
      type: "rectangle",
      x: spanX,
      y: spanY,
      width: spanWidth,
      height: SPAN_HEIGHT,
      backgroundColor: COLOR_PALETTE.gray[1],
      strokeColor: DEFAULT_STROKE_COLOR,
      fillStyle: "cross-hatch",
      strokeWidth: 2,
      roundness: { type: 3 },
      boundElements: [{ type: "text", id: textId }],
      groupIds: [groupId],
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
    });
  });

  return {
    type: "excalidraw",
    version: 2,
    source: "timeline-generator",
    elements: elements,
    appState: {
      viewBackgroundColor: "#ffffff",
      gridSize: null,
    },
    files: {},
  };
};
