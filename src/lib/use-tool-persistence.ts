import { useState, useEffect, useCallback } from "react";

export interface GenerationHistoryItem<T = Record<string, unknown>> {
  id: string;
  timestamp: number;
  configuration: T;
  name?: string;
  version: number;
  deprecated?: boolean;
}

export interface ToolVersionInfo {
  currentVersion: number;
  migrations?: Record<
    number,
    (config: Record<string, unknown>) => Record<string, unknown>
  >;
}

export interface UseToolPersistenceOptions<T> {
  toolName: string;
  defaultConfiguration: T;
  maxHistoryItems?: number;
  version?: number;
}

export const useToolPersistence = <T extends Record<string, unknown>>({
  toolName,
  defaultConfiguration,
  maxHistoryItems = 10,
  version = 1,
}: UseToolPersistenceOptions<T>) => {
  const storageKey = `excalidraw-tools-${toolName}`;
  const historyKey = `${storageKey}-history`;

  const migrateConfiguration = useCallback(
    (_configuration: T, fromVersion: number): T => {
      console.warn(
        `Migration from version ${fromVersion} to ${version} not implemented. Using default configuration.`
      );
      return defaultConfiguration;
    },
    [version, defaultConfiguration]
  );

  const loadConfiguration = useCallback((): T => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const storedVersion = parsed.version || 1;

        if (storedVersion < version) {
          const migrated = migrateConfiguration(parsed, storedVersion);
          localStorage.setItem(
            storageKey,
            JSON.stringify({ ...migrated, version })
          );
          return { ...defaultConfiguration, ...migrated };
        }

        return { ...defaultConfiguration, ...parsed };
      }
    } catch (error) {
      console.warn(`Failed to load configuration for ${toolName}:`, error);
    }
    return defaultConfiguration;
  }, [
    storageKey,
    defaultConfiguration,
    toolName,
    version,
    migrateConfiguration,
  ]);

  const loadHistory = useCallback((): GenerationHistoryItem<T>[] => {
    try {
      const saved = localStorage.getItem(historyKey);
      if (saved) {
        const items: GenerationHistoryItem<T>[] = JSON.parse(saved);

        return items.map((item) => {
          const itemVersion = item.version || 1;
          const isDeprecated = itemVersion < version;

          return {
            ...item,
            deprecated: isDeprecated,
          };
        });
      }
    } catch (error) {
      console.warn(`Failed to load history for ${toolName}:`, error);
    }
    return [];
  }, [historyKey, toolName, version]);

  const [configuration, setConfigurationState] = useState<T>(loadConfiguration);
  const [history, setHistoryState] =
    useState<GenerationHistoryItem<T>[]>(loadHistory);

  useEffect(() => {
    try {
      const configWithVersion = { ...configuration, version };
      localStorage.setItem(storageKey, JSON.stringify(configWithVersion));
    } catch (error) {
      console.warn(`Failed to save configuration for ${toolName}:`, error);
    }
  }, [configuration, storageKey, toolName, version]);

  useEffect(() => {
    try {
      localStorage.setItem(historyKey, JSON.stringify(history));
    } catch (error) {
      console.warn(`Failed to save history for ${toolName}:`, error);
    }
  }, [history, historyKey, toolName]);

  const setConfiguration = useCallback((newConfig: T) => {
    setConfigurationState(newConfig);
  }, []);

  const updateConfiguration = useCallback((key: keyof T, value: T[keyof T]) => {
    setConfigurationState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const addToHistory = useCallback(
    (config: T, name?: string) => {
      const newItem: GenerationHistoryItem<T> = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        configuration: { ...config },
        name,
        version,
      };

      setHistoryState((prev) => {
        const newHistory = [newItem, ...prev];
        return newHistory.slice(0, maxHistoryItems);
      });

      return newItem.id;
    },
    [maxHistoryItems, version]
  );

  const loadFromHistory = useCallback(
    (item: GenerationHistoryItem<T>) => {
      if (item.deprecated) {
        console.warn(
          `Loading deprecated configuration from version ${item.version}. Consider updating to current version ${version}.`
        );
      }

      let configToLoad = item.configuration;
      if (item.version && item.version < version) {
        try {
          configToLoad = migrateConfiguration(item.configuration, item.version);
        } catch (error) {
          console.warn("Migration failed, using configuration as-is:", error);
        }
      }

      setConfiguration(configToLoad);
    },
    [setConfiguration, version, migrateConfiguration]
  );

  const deleteFromHistory = useCallback((id: string) => {
    setHistoryState((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistoryState([]);
  }, []);

  const resetConfiguration = useCallback(() => {
    setConfiguration(defaultConfiguration);
  }, [defaultConfiguration, setConfiguration]);

  return {
    configuration,
    setConfiguration,
    updateConfiguration,
    history,
    addToHistory,
    loadFromHistory,
    deleteFromHistory,
    clearHistory,
    resetConfiguration,
  };
};
