export interface SkeletonConfiguration {
  kinematicTree: string;
  showJointNumbers: boolean;
  csvData?: string;
  jointSize: number;
  scale: number;
}

export interface Joint {
  x: number;
  y: number;
  z: number;
}

export interface SkeletonPose {
  joints: Joint[];
}

export const KINEMATIC_TREES = {
  smpljoints: [
    [0, 3, 6, 9, 12, 15], // spine chain
    [9, 13, 16, 18, 20], // right arm
    [9, 14, 17, 19, 21], // left arm
    [0, 1, 4, 7, 10], // right leg
    [0, 2, 5, 8, 11], // left leg
  ],
  guoh3djoints: [
    [0, 3, 6, 9, 12, 15], // spine chain
    [9, 13, 16, 18, 20], // right arm
    [9, 14, 17, 19, 21], // left arm
    [0, 1, 4, 7, 10], // right leg
    [0, 2, 5, 8, 11], // left leg
  ],
};

export const KINEMATIC_TREE_OPTIONS = [
  { value: "smpljoints", label: "SMPL Joints" },
  { value: "guoh3djoints", label: "GuoH3D Joints" },
];

const DEFAULT_T_POSE: Joint[] = [
  // Root (pelvis) - joint 0
  { x: 0, y: 0, z: 0 },

  // Right leg
  { x: 0.15, y: 0, z: 0 }, // joint 1 - right hip
  { x: -0.15, y: 0, z: 0 }, // joint 2 - left hip
  { x: 0, y: 0.2, z: 0 }, // joint 3 - lower spine

  // Right leg continued
  { x: 0.15, y: -0.4, z: 0 }, // joint 4 - right knee
  { x: -0.15, y: -0.4, z: 0 }, // joint 5 - left knee
  { x: 0, y: 0.4, z: 0 }, // joint 6 - upper spine

  // Ankles
  { x: 0.15, y: -0.8, z: 0 }, // joint 7 - right ankle
  { x: -0.15, y: -0.8, z: 0 }, // joint 8 - left ankle
  { x: 0, y: 0.6, z: 0 }, // joint 9 - chest

  // Feet
  { x: 0.15, y: -0.9, z: 0.1 }, // joint 10 - right foot
  { x: -0.15, y: -0.9, z: 0.1 }, // joint 11 - left foot

  // Neck/Head
  { x: 0, y: 0.7, z: 0 }, // joint 12 - neck
  { x: 0.3, y: 0.6, z: 0 }, // joint 13 - right shoulder
  { x: -0.3, y: 0.6, z: 0 }, // joint 14 - left shoulder
  { x: 0, y: 0.85, z: 0 }, // joint 15 - head

  // Right arm
  { x: 0.5, y: 0.6, z: 0 }, // joint 16 - right elbow
  { x: -0.5, y: 0.6, z: 0 }, // joint 17 - left elbow
  { x: 0.7, y: 0.6, z: 0 }, // joint 18 - right wrist
  { x: -0.7, y: 0.6, z: 0 }, // joint 19 - left wrist

  // Hands
  { x: 0.8, y: 0.6, z: 0 }, // joint 20 - right hand
  { x: -0.8, y: 0.6, z: 0 }, // joint 21 - left hand
];

export const parseCsvData = (csvContent: string): SkeletonPose | null => {
  try {
    const lines = csvContent.trim().split("\n");
    const joints: Joint[] = [];

    for (const line of lines) {
      const parts = line.split(",").map((part) => part.trim());
      if (parts.length >= 4) {
        const jointIndex = parseInt(parts[0]);
        const x = parseFloat(parts[1]);
        const y = parseFloat(parts[2]);
        const z = parseFloat(parts[3]);

        if (!isNaN(jointIndex) && !isNaN(x) && !isNaN(y) && !isNaN(z)) {
          joints[jointIndex] = { x, y, z };
        }
      }
    }

    for (let i = 0; i < 22; i++) {
      if (!joints[i]) {
        joints[i] = DEFAULT_T_POSE[i] || { x: 0, y: 0, z: 0 };
      }
    }

    return { joints };
  } catch (error) {
    console.error("Error parsing CSV data:", error);
    return null;
  }
};

export const getDefaultPose = (): SkeletonPose => {
  return { joints: [...DEFAULT_T_POSE] };
};

interface ExcalidrawElement {
  type: string;
  version: number;
  versionNonce: number;
  isDeleted: boolean;
  id: string;
  fillStyle: string;
  strokeWidth: number;
  strokeStyle: string;
  roughness: number;
  opacity: number;
  angle: number;
  x: number;
  y: number;
  strokeColor: string;
  backgroundColor: string;
  width?: number;
  height?: number;
  seed: number;
  groupIds: string[];
  frameId: null;
  roundness: null;
  boundElements: Array<{ id: string; type: string }>;
  updated: number;
  link: null;
  locked: boolean;
  startBinding?: { elementId: string; focus: number; gap: number } | null;
  endBinding?: { elementId: string; focus: number; gap: number } | null;
  lastCommittedPoint?: null;
  startArrowhead?: null;
  endArrowhead?: null;
  points?: number[][];
  fontSize?: number;
  fontFamily?: number;
  text?: string;
  textAlign?: string;
  verticalAlign?: string;
  containerId?: string | null;
  originalText?: string;
  lineHeight?: number;
}

export const generateSkeletonData = (config: SkeletonConfiguration) => {
  const pose = config.csvData
    ? parseCsvData(config.csvData) || getDefaultPose()
    : getDefaultPose();

  const kinematicTree =
    KINEMATIC_TREES[config.kinematicTree as keyof typeof KINEMATIC_TREES];

  if (!kinematicTree) {
    throw new Error(`Unknown kinematic tree: ${config.kinematicTree}`);
  }

  const elements: ExcalidrawElement[] = [];
  let idCounter = 1;

  const baseX = 400;
  const baseY = 400;
  const scale = config.scale;

  const project3DTo2D = (joint: Joint) => ({
    x: baseX + joint.x * scale,
    y: baseY - joint.y * scale,
  });

  kinematicTree.forEach((chain, chainIndex) => {
    for (let i = 0; i < chain.length - 1; i++) {
      const fromJoint = pose.joints[chain[i]];
      const toJoint = pose.joints[chain[i + 1]];

      if (fromJoint && toJoint) {
        const fromPos = project3DTo2D(fromJoint);
        const toPos = project3DTo2D(toJoint);

        elements.push({
          type: "arrow",
          version: 1,
          versionNonce: idCounter++,
          isDeleted: false,
          id: `bone_${chainIndex}_${i}`,
          fillStyle: "solid",
          strokeWidth: 3,
          strokeStyle: "solid",
          roughness: 0,
          opacity: 100,
          angle: 0,
          x: fromPos.x,
          y: fromPos.y,
          strokeColor: "#1e1e1e",
          backgroundColor: "transparent",
          width: toPos.x - fromPos.x,
          height: toPos.y - fromPos.y,
          seed: Math.floor(Math.random() * 1000000),
          groupIds: [],
          frameId: null,
          roundness: null,
          boundElements: [],
          updated: 1,
          link: null,
          locked: false,
          startBinding: {
            elementId: `joint_${chain[i]}`,
            focus: 0,
            gap: 1,
          },
          endBinding: {
            elementId: `joint_${chain[i + 1]}`,
            focus: 0,
            gap: 1,
          },
          lastCommittedPoint: null,
          startArrowhead: null,
          endArrowhead: null,
          points: [
            [0, 0],
            [toPos.x - fromPos.x, toPos.y - fromPos.y],
          ],
        });
      }
    }
  });

  pose.joints.forEach((joint, index) => {
    const pos = project3DTo2D(joint);

    const circleElement: ExcalidrawElement = {
      type: "ellipse",
      version: 1,
      versionNonce: idCounter++,
      isDeleted: false,
      id: `joint_${index}`,
      fillStyle: "solid",
      strokeWidth: 2,
      strokeStyle: "solid",
      roughness: 0,
      opacity: 100,
      angle: 0,
      x: pos.x - config.jointSize / 2,
      y: pos.y - config.jointSize / 2,
      strokeColor: "#1e1e1e",
      backgroundColor: "#ffffff",
      width: config.jointSize,
      height: config.jointSize,
      seed: Math.floor(Math.random() * 1000000),
      groupIds: [],
      frameId: null,
      roundness: null,
      boundElements: config.showJointNumbers
        ? [{ id: `label_${index}`, type: "text" }]
        : [],
      updated: 1,
      link: null,
      locked: false,
    };

    elements.push(circleElement);

    if (config.showJointNumbers) {
      elements.push({
        type: "text",
        version: 1,
        versionNonce: idCounter++,
        isDeleted: false,
        id: `label_${index}`,
        fillStyle: "solid",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        angle: 0,
        x: pos.x - config.jointSize / 4,
        y: pos.y - config.jointSize / 4,
        strokeColor: "#1e1e1e",
        backgroundColor: "transparent",
        width: config.jointSize / 2,
        height: config.jointSize / 2,
        seed: Math.floor(Math.random() * 1000000),
        groupIds: [],
        frameId: null,
        roundness: null,
        boundElements: [],
        updated: 1,
        link: null,
        locked: false,
        // fontSize: Math.max(8, config.jointSize / 2),
        // fontSize: Math.max(4, config.jointSize / 2),
        fontSize: 2,
        fontFamily: 1,
        text: index.toString(),
        textAlign: "center",
        verticalAlign: "middle",
        containerId: `joint_${index}`,
        originalText: index.toString(),
        lineHeight: 1.2,
      });
    }
  });

  return {
    type: "excalidraw",
    version: 2,
    source: "excalidraw-tools",
    elements: elements,
    appState: {
      gridSize: null,
      viewBackgroundColor: "#ffffff",
    },
    files: {},
  };
};
