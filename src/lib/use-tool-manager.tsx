import { useState, useCallback } from "react";
import {
  useToolPersistence,
  type GenerationHistoryItem,
} from "@/lib/use-tool-persistence";
import { Link } from "@radix-ui/themes";

export interface UseToolManagerOptions<T extends Record<string, unknown>> {
  toolName: string;
  defaultConfiguration: T;
  generateFunction: (config: T) => Record<string, unknown>;
  getHistoryName?: (config: T) => string;
  maxHistoryItems?: number;
  version?: number;
}

export interface ToolManagerState<T extends Record<string, unknown>> {
  configuration: T;
  updateConfiguration: (key: keyof T, value: T[keyof T]) => void;
  setConfiguration: (config: T) => void;
  status: {
    type: "success" | "error" | null;
    message: React.ReactNode | string;
    data?: string;
  };
  isLoading: boolean;
  generateAndCopy: () => Promise<void>;
  closeStatus: () => void;
  history: GenerationHistoryItem<T>[];
  loadFromHistory: (item: GenerationHistoryItem<T>) => void;
  deleteFromHistory: (id: string) => void;
  clearHistory: () => void;
  resetConfiguration: () => void;
}

export const useToolManager = <T extends Record<string, unknown>>({
  toolName,
  defaultConfiguration,
  generateFunction,
  getHistoryName,
  maxHistoryItems = 15,
  version = 1,
}: UseToolManagerOptions<T>): ToolManagerState<T> => {
  const {
    configuration,
    updateConfiguration: updateConfig,
    setConfiguration,
    history,
    addToHistory,
    loadFromHistory,
    deleteFromHistory,
    clearHistory,
    resetConfiguration,
  } = useToolPersistence({
    toolName,
    defaultConfiguration,
    maxHistoryItems,
    version,
  });

  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: React.ReactNode | string;
    data?: string;
  }>({
    type: null,
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateConfiguration = useCallback(
    (key: keyof T, value: T[keyof T]) => {
      updateConfig(key, value);
    },
    [updateConfig]
  );

  const closeStatus = useCallback(() => {
    setStatus({ type: null, message: "" });
  }, []);

  const generateAndCopy = useCallback(async () => {
    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const json = generateFunction(configuration as T);
      const jsonString = JSON.stringify(json, null, 2);

      await navigator.clipboard.writeText(jsonString);

      const historyName = getHistoryName
        ? getHistoryName(configuration as T)
        : `Generated ${toolName}`;

      addToHistory(configuration as T, historyName);

      setStatus({
        type: "success",
        message: (
          <>
            ✅ {toolName} copied to clipboard! Go to{" "}
            <Link target="_blank" href="https://www.excalidraw.com">
              excalidraw.com
            </Link>{" "}
            and press Ctrl+V to paste.
          </>
        ),
      });
    } catch (error) {
      console.error(`[error]: failed auto copy for ${toolName}.`, error);

      const json = generateFunction(configuration as T);
      const jsonString = JSON.stringify(json, null, 2);

      setStatus({
        type: "error",
        message:
          "❌ Failed to copy to clipboard. You can copy the data manually below:",
        data: jsonString,
      });
    } finally {
      setIsLoading(false);
    }
  }, [configuration, generateFunction, getHistoryName, toolName, addToHistory]);

  return {
    configuration: configuration as T,
    updateConfiguration,
    setConfiguration,
    status,
    isLoading,
    generateAndCopy,
    history: history as GenerationHistoryItem<T>[],
    loadFromHistory,
    deleteFromHistory,
    clearHistory,
    resetConfiguration,
    closeStatus,
  };
};
