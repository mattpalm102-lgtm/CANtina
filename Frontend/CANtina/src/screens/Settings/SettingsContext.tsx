import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "dark" | "light";

interface Settings {
  theme: ThemeMode;
  // future settings go here:
}

interface SettingsContextType {
  settings: Settings;
  setTheme: (mode: ThemeMode) => void;
}

const STORAGE_KEY = "cantina_settings";

const defaultSettings: Settings = {
  theme: "dark",
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  // Persist settings across app restarts
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setTheme = (mode: ThemeMode) => {
    setSettings((prev) => ({ ...prev, theme: mode }));
  };

  return (
    <SettingsContext.Provider value={{ settings, setTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
}
