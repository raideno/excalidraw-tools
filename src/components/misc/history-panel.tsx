import React from "react";
import {
  ClockIcon,
  Cross1Icon,
  TrashIcon,
  ResetIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import * as Collapsible from "@radix-ui/react-collapsible";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  Text,
  Badge,
} from "@radix-ui/themes";

import { cn } from "@/lib/utils";
import type { GenerationHistoryItem } from "@/lib/use-tool-persistence";

export interface HistoryPanelProps<T> {
  history: GenerationHistoryItem<T>[];
  onLoadFromHistory: (item: GenerationHistoryItem<T>) => void;
  onDeleteFromHistory: (id: string) => void;
  onClearHistory: () => void;
  onResetConfiguration: () => void;
  className?: string;
}

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

const formatConfigurationPreview = (
  config: Record<string, unknown>
): string => {
  const entries = Object.entries(config);
  const preview = entries
    .slice(0, 3)
    .map(([key, value]) => {
      const displayValue =
        typeof value === "string" && value.length > 20
          ? `${value.substring(0, 20)}...`
          : String(value);
      return `${key}: ${displayValue}`;
    })
    .join(", ");

  return entries.length > 3 ? `${preview}...` : preview;
};

export const HistoryPanel = <T extends Record<string, unknown>>({
  history,
  onLoadFromHistory,
  onDeleteFromHistory,
  onClearHistory,
  onResetConfiguration,
  className,
}: HistoryPanelProps<T>) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Box className={cn("w-full", className)}>
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <Collapsible.Trigger asChild>
          <Button
            variant="outline"
            className="!w-full !cursor-pointer"
            size="2"
          >
            <ClockIcon />
            <Text>History ({history.length})</Text>
          </Button>
        </Collapsible.Trigger>

        <Collapsible.Content>
          <Box mt="3">
            <Card>
              <Box>
                <Flex direction="column" gap="3">
                  <Flex justify="between" align="center">
                    <Heading size="3">Generation History</Heading>
                    <Flex gap="2">
                      <Button
                        variant="soft"
                        size="1"
                        color="gray"
                        className="!cursor-pointer"
                        onClick={onResetConfiguration}
                      >
                        <ResetIcon />
                        Reset
                      </Button>
                      {history.length > 0 && (
                        <Button
                          variant="soft"
                          size="1"
                          color="red"
                          className="!cursor-pointer"
                          onClick={onClearHistory}
                        >
                          <TrashIcon />
                          Clear All
                        </Button>
                      )}
                    </Flex>
                  </Flex>

                  {history.length === 0 ? (
                    <Box style={{ textAlign: "center" }}>
                      <Text size="2" color="gray">
                        No generation history yet. Generate something to see it
                        here!
                      </Text>
                    </Box>
                  ) : (
                    <Flex direction="column" gap="2">
                      {history.map((item) => (
                        <Card
                          key={item.id}
                          className={cn(
                            "!cursor-pointer transition-colors",
                            "hover:bg-[var(--gray-3)]"
                          )}
                          onClick={() => onLoadFromHistory(item)}
                          variant="surface"
                        >
                          <Box>
                            <Flex justify="between" align="start" gap="2">
                              <Box style={{ flex: 1, minWidth: 0 }}>
                                <Flex align="center" gap="2" mb="1" wrap="wrap">
                                  <Text size="2" weight="medium">
                                    {item.name || "Unnamed Generation"}
                                  </Text>
                                  {item.deprecated && (
                                    <Badge color="orange" size="1">
                                      <ExclamationTriangleIcon width={10} height={10} />
                                      Deprecated
                                    </Badge>
                                  )}
                                  <Text size="1" color="gray">
                                    v{item.version || 1}
                                  </Text>
                                  <Text size="1" color="gray">
                                    {formatTimestamp(item.timestamp)}
                                  </Text>
                                </Flex>
                                <Text
                                  size="1"
                                  color="gray"
                                  style={{
                                    wordBreak: "break-all",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {formatConfigurationPreview(
                                    item.configuration
                                  )}
                                </Text>
                                {item.deprecated && (
                                  <Text size="1" color="orange" style={{ marginTop: "4px" }}>
                                    This configuration is from an older version and may not work correctly.
                                  </Text>
                                )}
                              </Box>
                              <IconButton
                                size="1"
                                variant="ghost"
                                color="red"
                                className="!cursor-pointer flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteFromHistory(item.id);
                                }}
                              >
                                <Cross1Icon />
                              </IconButton>
                            </Flex>
                          </Box>
                        </Card>
                      ))}
                    </Flex>
                  )}
                </Flex>
              </Box>
            </Card>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
};
