import type { ProgressConfiguration } from "@/tools/progress/configuration";

export const generateProgressData = (config: ProgressConfiguration) => {
  const elements: Array<unknown> = [];
  let idCounter = 1;
  const nextId = () => {
    const id = String(idCounter);
    idCounter += 1;
    return id;
  };

  const startX = 100;
  const startY = 100;

  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

  const width = Math.max(1, Math.floor(config.width));
  const height = Math.max(1, Math.floor(config.height));
  const progressPct = clamp(Math.round(config.progress), 0, 100);
  const padX = Math.max(2, Math.min(24, Math.round(width * 0.02)));
  const padY = Math.max(2, Math.min(16, Math.round(height * 0.2)));
  const innerStartX = startX + padX;
  const innerStartY = startY + padY;
  const innerWidth = Math.max(0, width - padX * 2);
  const innerHeight = Math.max(1, height - padY * 2);
  const progressWidth = Math.round((innerWidth * progressPct) / 100);

  elements.push({
    id: nextId(),
    type: "rectangle",
    x: startX,
    y: startY,
    width,
    height,
    angle: 0,
    strokeColor: "#000000",
    backgroundColor: "#ffffff",
    fillStyle: "solid",
    strokeWidth: 2,
    roughness: 1,
    opacity: 100,
    groupIds: [],
    roundness: { type: 2 },
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
  });

  if (progressWidth > 0) {
    elements.push({
      id: nextId(),
      type: "rectangle",
      x: innerStartX,
      y: innerStartY,
      width: progressWidth,
      height: innerHeight,
      angle: 0,
      strokeColor: "#000000",
      backgroundColor: "#4c9ffe",
      fillStyle: "solid",
      strokeWidth: 1,
      roughness: 1,
      opacity: 100,
      groupIds: [],
      roundness: { type: 2 },
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
    });
  }

  const addTick = (x: number) => {
    const tickWidth = 2;
    const tickHeight = height + 12;
    const tickX = Math.round(x - tickWidth / 2);
    const tickY = startY - 6;
    elements.push({
      id: nextId(),
      type: "rectangle",
      x: tickX,
      y: tickY,
      width: tickWidth,
      height: tickHeight,
      angle: 0,
      strokeColor: "#000000",
      backgroundColor: "#000000",
      fillStyle: "solid",
      strokeWidth: 1,
      roughness: 1,
      opacity: 100,
      groupIds: [],
      roundness: { type: 2 },
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
    });
  };

  const addTickLabel = (x: number, label: string) => {
    const fontSize = 12;
    const approxHalfTextWidth = (label.length * fontSize) / 4;
    const textX = Math.round(x - approxHalfTextWidth);
    const textY = startY - 6 - fontSize - 2;
    elements.push({
      id: nextId(),
      type: "text",
      x: textX,
      y: textY,
      text: label,
      fontSize,
      fontFamily: 5,
      strokeColor: "#000000",
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      groupIds: [],
    });
  };

  if (config.showProgressTick) {
    const xProgress = innerStartX + progressWidth;
    const isAtStart = progressPct === 0;
    const isAtEnd = progressPct === 100;
    const coincidesWithEnd = config.showEndTicks && (isAtStart || isAtEnd);
    if (!coincidesWithEnd) {
      addTick(xProgress);
      addTickLabel(xProgress, `${progressPct}%`);
    }
  }

  if (config.showEndTicks) {
    const x0 = innerStartX;
    const x100 = innerStartX + innerWidth;
    addTick(x0);
    addTickLabel(x0, "0%");
    addTick(x100);
    addTickLabel(x100, "100%");
  }

  return {
    type: "excalidraw",
    version: 2,
    source: "progress-generator",
    elements,
    appState: {
      viewBackgroundColor: "#ffffff",
      gridSize: null,
    },
    files: {},
  };
};
