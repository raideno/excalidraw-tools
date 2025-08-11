import type { TableConfiguration } from "./configuration";

export const generateTableData = (tableConfiguration: TableConfiguration) => {
  const elements: Array<unknown> = [];
  let idCounter = 1;
  const startX = 100;
  const startY = 100;
  const headerHeight = tableConfiguration.hasHeaderRow
    ? tableConfiguration.cellHeight + 20
    : tableConfiguration.cellHeight;
  const primaryColumnWidth = tableConfiguration.hasPrimaryColumn
    ? tableConfiguration.cellWidth + 20
    : tableConfiguration.cellWidth;

  for (let r = 0; r < tableConfiguration.rows; r++) {
    for (let c = 0; c < tableConfiguration.cols; c++) {
      const width =
        tableConfiguration.hasPrimaryColumn && c === 0
          ? primaryColumnWidth
          : tableConfiguration.cellWidth;
      const x =
        startX +
        (c === 0
          ? 0
          : primaryColumnWidth + (c - 1) * tableConfiguration.cellWidth);
      const y =
        startY +
        r * tableConfiguration.cellHeight +
        (tableConfiguration.hasHeaderRow
          ? r === 0
            ? 0
            : headerHeight - tableConfiguration.cellHeight
          : 0);
      const height =
        tableConfiguration.hasHeaderRow && r === 0
          ? headerHeight
          : tableConfiguration.cellHeight;

      let backgroundColor = "#ffffff";
      if (
        r === 0 &&
        tableConfiguration.hasHeaderRow &&
        c === 0 &&
        tableConfiguration.hasPrimaryColumn
      ) {
        backgroundColor = "#b8b8b8";
      } else if (r === 0 && tableConfiguration.hasHeaderRow) {
        backgroundColor = "#d3d3d3";
      } else if (c === 0 && tableConfiguration.hasPrimaryColumn) {
        backgroundColor = "#e8e8e8";
      } else if (tableConfiguration.hasStripes) {
        const dataRowIndex = tableConfiguration.hasHeaderRow ? r - 1 : r;
        if (dataRowIndex >= 0 && dataRowIndex % 2 === 1) {
          backgroundColor = "#f5f5f5";
        }
      }

      elements.push({
        id: idCounter.toString(),
        type: "rectangle",
        x: x,
        y: y,
        width: width,
        height: height,
        angle: 0,
        strokeColor: "#000000",
        backgroundColor: backgroundColor,
        fillStyle: "solid",
        strokeWidth: 1,
        roughness: 1,
        opacity: 100,
        groupIds: [],
        roundness: null,
        seed: Math.floor(Math.random() * 100000),
        version: 1,
        versionNonce: Math.floor(Math.random() * 100000),
        isDeleted: false,
        boundElements: null,
        updated: Date.now(),
        link: null,
        locked: false,
      });
      idCounter++;
    }
  }

  return {
    type: "excalidraw",
    version: 2,
    source: "table-generator",
    elements: elements,
    appState: {
      viewBackgroundColor: "#ffffff",
      gridSize: null,
    },
    files: {},
  };
};
