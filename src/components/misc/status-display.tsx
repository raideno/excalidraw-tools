import React from "react";
import { CopyIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Text, IconButton } from "@radix-ui/themes";
import { cn } from "@/lib/utils";

export interface StatusDisplayProps {
  status: {
    type: "success" | "error" | null;
    message: React.ReactNode | string;
    data?: string;
  };
  onClose?: () => void;
  onCopyManually?: () => void;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({
  status,
  onClose,
  onCopyManually,
}) => {
  if (!status.type) return null;

  const copyManually = async () => {
    if (status.data && onCopyManually) {
      onCopyManually();
    } else if (status.data) {
      try {
        await navigator.clipboard.writeText(status.data);
      } catch (error) {
        console.error("[error]: failed to copy manually.", error);
      }
    }
  };

  const handleCloseStatus = () => {
    if (onClose) onClose();
  };

  return (
    <Box
      p="3"
      className={cn(
        "rounded-[var(--radius-2)] border border-solid",
        status.type === "success" &&
          "bg-[var(--green-2)] border-[var(--green-8)]",
        status.type === "error" && "bg-[var(--red-2)] border-[var(--red-8)]"
      )}
    >
      <Flex justify="between" align="center" gap="2">
        <Text size="2">{status.message}</Text>
        <IconButton
          size="1"
          color="gray"
          variant="ghost"
          onClick={handleCloseStatus}
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
  );
};
