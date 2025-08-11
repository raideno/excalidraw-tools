import React from "react";

import { SwitchField } from "@/components/ui/switch-field";
import { SelectField } from "@/components/ui/select-field";
import { NumberInputField } from "@/components/ui/number-input-field";

import type { ToolComponentProps } from "@/tools";

import { KINEMATIC_TREES } from "@/tools/skeleton/helpers";
import type { SkeletonConfig } from "@/tools/skeleton/configuration";

export const SkeletonToolControls: React.FC<
  ToolComponentProps<SkeletonConfig>
> = ({ configuration, onConfigurationChange }) => {
  return (
    <div className="space-y-4">
      <SelectField
        label="Kinematic Tree"
        value={configuration.kinematicTree}
        onChange={(kinematicTree) =>
          onConfigurationChange(
            "kinematicTree",
            kinematicTree as keyof typeof KINEMATIC_TREES
          )
        }
        options={Object.keys(KINEMATIC_TREES).map((key) => ({
          value: key,
          label: key,
        }))}
      />

      <NumberInputField
        label="Joint Size"
        value={configuration.jointSize}
        onChange={(jointSize) => onConfigurationChange("jointSize", jointSize)}
      />

      <NumberInputField
        label="Scale"
        value={configuration.scale}
        onChange={(scale) => onConfigurationChange("scale", scale)}
      />

      <SwitchField
        label="Show Joint Numbers"
        description="Display joint numbers on the skeleton"
        checked={configuration.showJointNumbers}
        onCheckedChange={(showJointNumbers) =>
          onConfigurationChange("showJointNumbers", showJointNumbers)
        }
      />
    </div>
  );
};
