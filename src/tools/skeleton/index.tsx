import React from "react";

import { CopyIcon, Cross1Icon, UploadIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Flex,
  Text,
  IconButton,
  TextArea,
} from "@radix-ui/themes";

import { cn } from "@/lib/utils";

import {
  generateSkeletonData,
  KINEMATIC_TREE_OPTIONS,
} from "@/tools/skeleton/helpers";
import type { SkeletonConfiguration } from "@/tools/skeleton/helpers";

import { NumberInputField } from "@/components/ui/number-input-field";
import { SwitchField } from "@/components/ui/switch-field";
import { SelectField } from "@/components/ui/select-field";

const DEFAULT_CONFIGURATION: SkeletonConfiguration = {
  kinematicTree: "smpljoints",
  showJointNumbers: true,
  csvData: "",
  jointSize: 16,
  scale: 200,
};

interface Status {
  type: "success" | "error" | null;
  message: string;
  data?: string;
}

export type SkeletonToolProps = {
  defaultConfiguration?: SkeletonConfiguration;
};

export const SkeletonTool: React.FC<SkeletonToolProps> = ({
  defaultConfiguration = DEFAULT_CONFIGURATION,
}) => {
  const [configuration, setConfiguration] =
    React.useState<SkeletonConfiguration>(defaultConfiguration);

  const [status, setStatus] = React.useState<Status>({
    type: null,
    message: "",
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const updateConfig = <K extends keyof SkeletonConfiguration>(
    key: K,
    value: SkeletonConfiguration[K]
  ) => {
    setConfiguration((prev) => ({ ...prev, [key]: value }));
  };

  const generateAndCopySkeleton = async () => {
    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const json = generateSkeletonData(configuration);
      const jsonString = JSON.stringify(json, null, 2);

      await navigator.clipboard.writeText(jsonString);

      setStatus({
        type: "success",
        message:
          "✅ Skeleton copied to clipboard! Go to excalidraw.com and press Ctrl+V to paste.",
      });
    } catch (error) {
      console.error("[error]: failed auto copy.", error);

      try {
        const json = generateSkeletonData(configuration);
        const jsonString = JSON.stringify(json, null, 2);

        setStatus({
          type: "error",
          message:
            "❌ Failed to copy to clipboard. You can copy the data manually below:",
          data: jsonString,
        });
      } catch (generateError) {
        setStatus({
          type: "error",
          message: `❌ Failed to generate skeleton: ${
            generateError instanceof Error
              ? generateError.message
              : "Unknown error"
          }`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvContent = e.target?.result as string;
        updateConfig("csvData", csvContent);
      };
      reader.readAsText(file);
    } else {
      setStatus({
        type: "error",
        message: "❌ Please select a valid CSV file.",
      });
    }
  };

  const clearCsvData = () => {
    updateConfig("csvData", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeStatus = () => {
    setStatus({ type: null, message: "" });
  };

  const copyManually = async () => {
    if (status.data) {
      try {
        await navigator.clipboard.writeText(status.data);
        setStatus({
          type: "success",
          message: "✅ Skeleton data copied to clipboard!",
        });
      } catch (error) {
        console.error("[error]: failed to copy manually.", error);
      }
    }
  };

  return (
    <Box>
      <Flex direction="column" gap="3">
        <SelectField
          label="Kinematic Tree"
          value={configuration.kinematicTree}
          options={KINEMATIC_TREE_OPTIONS}
          onChange={(value) => updateConfig("kinematicTree", value)}
        />

        <Flex gap="4">
          <NumberInputField
            label="Joint Size"
            value={configuration.jointSize}
            min={4}
            onChange={(v) => updateConfig("jointSize", v)}
            onIncrement={() =>
              updateConfig("jointSize", configuration.jointSize + 1)
            }
            onDecrement={() =>
              configuration.jointSize > 4 &&
              updateConfig("jointSize", configuration.jointSize - 1)
            }
          />
          <NumberInputField
            label="Scale"
            value={configuration.scale}
            min={50}
            onChange={(v) => updateConfig("scale", v)}
            onIncrement={() => updateConfig("scale", configuration.scale + 10)}
            onDecrement={() =>
              configuration.scale > 50 &&
              updateConfig("scale", configuration.scale - 10)
            }
          />
        </Flex>

        <SwitchField
          label="Show Joint Numbers"
          description="Display joint index numbers inside each joint circle."
          checked={configuration.showJointNumbers}
          onCheckedChange={(checked) =>
            updateConfig("showJointNumbers", checked)
          }
        />

        <Box>
          <Text as="div" size="2" weight="medium" mb="2">
            Custom Pose Data (CSV) (Optional)
          </Text>
          <Text as="div" size="1" color="gray" mb="2">
            Upload a CSV file with columns: joint_index, x, y, z. Leave empty
            for default T-pose.
          </Text>

          <Flex gap="2" mb="2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <Button
              size="2"
              variant="soft"
              onClick={() => fileInputRef.current?.click()}
              className="!w-full !cursor-pointer"
            >
              <UploadIcon />
              Upload CSV
            </Button>

            {configuration.csvData && (
              <Button
                size="2"
                variant="soft"
                color="red"
                onClick={clearCsvData}
                className="!cursor-pointer"
              >
                Clear CSV
              </Button>
            )}
          </Flex>

          {configuration.csvData && (
            <TextArea
              placeholder="CSV data will appear here..."
              value={configuration.csvData}
              onChange={(e) => updateConfig("csvData", e.target.value)}
              rows={4}
              className="font-mono text-xs"
            />
          )}
        </Box>

        <Button
          size="3"
          variant="classic"
          onClick={generateAndCopySkeleton}
          loading={isLoading}
          className="!cursor-pointer"
        >
          🦴 Generate & Copy Skeleton
        </Button>

        {status.type && (
          <Box
            p="3"
            className={cn(
              "rounded-[var(--radius-2)] border border-solid",
              status.type === "success" &&
                "bg-[var(--green-2)] border-[var(--green-8)]",
              status.type === "error" &&
                "bg-[var(--red-2)] border-[var(--red-8)]"
            )}
          >
            <Flex justify="between" align="center" gap="2">
              <Text size="2">{status.message}</Text>
              <IconButton
                size="1"
                color="gray"
                variant="ghost"
                onClick={closeStatus}
                className="!cursor-pointer"
              >
                <Cross1Icon />
              </IconButton>
            </Flex>
            <Box>
              {status.data && (
                <Box mt="2">
                  <Flex align="center" gap="2" mb="2">
                    <Button
                      color="gray"
                      size="1"
                      variant="soft"
                      className="!w-full !cursor-pointer"
                      onClick={copyManually}
                    >
                      <CopyIcon />
                      <Text>Copy Data</Text>
                    </Button>
                  </Flex>
                  <Box
                    p="2"
                    className={cn(
                      "font-mono text-xs",
                      "overflow-auto max-h-32",
                      "bg-[var(--gray-3)] rounded-[var(--radius-1)]",
                      "text-xs"
                    )}
                  >
                    <pre>{status.data}</pre>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Flex>
    </Box>
  );
};
