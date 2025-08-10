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
  migrations?: Record<number, (config: Record<string, unknown>) => Record<string, unknown>>;
}

export interface UseToolPersistenceOptions<T> {
  toolName: string;
  defaultConfiguration: T;
  maxHistoryItems?: number;
  versionInfo: ToolVersionInfo;
}

export const useToolPersistence = <T>({
  toolName,
  defaultConfiguration,
  maxHistoryItems = 10,
  versionInfo,
}: UseToolPersistenceOptions<T>) => {
  const storageKey = `excalidraw-tools-${toolName}`;
  const historyKey = `${storageKey}-history`;

  // Migration helper function
  const migrateConfiguration = useCallback((config: Record<string, unknown>, fromVersion: number): T => {
    let migratedConfig = { ...config };
    
    // Apply migrations in sequence from the stored version to current
    for (let version = fromVersion; version < versionInfo.currentVersion; version++) {
      const migration = versionInfo.migrations?.[version + 1];
      if (migration) {
        try {
          migratedConfig = migration(migratedConfig);
        } catch (error) {
          console.warn(`Migration from version ${version} to ${version + 1} failed for ${toolName}:`, error);
          // If migration fails, use default configuration
          return defaultConfiguration;
        }
      }
    }
    
    return { ...defaultConfiguration, ...migratedConfig } as T;
  }, [versionInfo, defaultConfiguration, toolName]);

  // Load initial configuration from localStorage
  const loadConfiguration = useCallback((): T => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const storedVersion = parsed.version || 1;
        
        if (storedVersion < versionInfo.currentVersion) {
          // Need migration
          const migrated = migrateConfiguration(parsed, storedVersion);
          // Save the migrated version
          localStorage.setItem(storageKey, JSON.stringify({ ...migrated, version: versionInfo.currentVersion }));
          return migrated;
        }
        
        // Same version, merge with default to handle new fields
        return { ...defaultConfiguration, ...parsed };
      }
    } catch (error) {
      console.warn(`Failed to load configuration for ${toolName}:`, error);
    }
    return defaultConfiguration;
  }, [storageKey, defaultConfiguration, toolName, versionInfo, migrateConfiguration]);

  // Load history from localStorage with migration support
  const loadHistory = useCallback((): GenerationHistoryItem<T>[] => {
    try {
      const saved = localStorage.getItem(historyKey);
      if (saved) {
        const items: GenerationHistoryItem<T>[] = JSON.parse(saved);
        
        // Mark items as deprecated if they're from older versions and no migration exists
        return items.map(item => {
          const itemVersion = item.version || 1;
          const isDeprecated = itemVersion < versionInfo.currentVersion && 
                              !versionInfo.migrations?.[itemVersion + 1];
          
          return {
            ...item,
            deprecated: isDeprecated
          };
        });
      }
    } catch (error) {
      console.warn(`Failed to load history for ${toolName}:`, error);
    }
    return [];
  }, [historyKey, toolName, versionInfo]);

  const [configuration, setConfigurationState] = useState<T>(loadConfiguration);
  const [history, setHistoryState] = useState<GenerationHistoryItem<T>[]>(loadHistory);

  // Save configuration to localStorage whenever it changes
  useEffect(() => {
    try {
      const configWithVersion = { ...configuration, version: versionInfo.currentVersion };
      localStorage.setItem(storageKey, JSON.stringify(configWithVersion));
    } catch (error) {
      console.warn(`Failed to save configuration for ${toolName}:`, error);
    }
  }, [configuration, storageKey, toolName, versionInfo.currentVersion]);

  // Save history to localStorage whenever it changes
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
    setConfigurationState(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const addToHistory = useCallback((config: T, name?: string) => {
    const newItem: GenerationHistoryItem<T> = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      configuration: { ...config },
      name,
      version: versionInfo.currentVersion,
    };

    setHistoryState(prev => {
      const newHistory = [newItem, ...prev];
      // Keep only the most recent items
      return newHistory.slice(0, maxHistoryItems);
    });

    return newItem.id;
  }, [maxHistoryItems, versionInfo.currentVersion]);

  const loadFromHistory = useCallback((item: GenerationHistoryItem<T>) => {
    if (item.deprecated) {
      console.warn(`Loading deprecated configuration from version ${item.version}. Consider updating to current version ${versionInfo.currentVersion}.`);
    }
    
    // Try to migrate if needed and possible
    let configToLoad = item.configuration;
    if (item.version && item.version < versionInfo.currentVersion) {
      try {
        configToLoad = migrateConfiguration(item.configuration as Record<string, unknown>, item.version);
      } catch (error) {
        console.warn(`Failed to migrate configuration from version ${item.version}:`, error);
        // Use the original configuration if migration fails
      }
    }
    
    setConfiguration(configToLoad);
  }, [setConfiguration, versionInfo.currentVersion, migrateConfiguration]);

  const deleteFromHistory = useCallback((id: string) => {
    setHistoryState(prev => prev.filter(item => item.id !== id));
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
