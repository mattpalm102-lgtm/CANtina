import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { darkTheme, lightTheme } from "./theme";
import type { Theme } from "./theme";
import { useSettings } from "./screens/Settings/SettingsContext";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { settings, setTheme } = useSettings();

  const isDark = settings.theme === "dark";
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
