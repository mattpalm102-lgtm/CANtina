import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useTheme } from "../../ThemeContext";

export default function SettingsPage() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(isDark ? "dark" : "light");

  // Sync local state if theme changes elsewhere
  useEffect(() => {
    setSelectedTheme(isDark ? "dark" : "light");
  }, [isDark]);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTheme(value);
    toggleTheme();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ display: "flex", flex: 1, justifyContent: "center", padding: "16px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "24px",
            borderRadius: "12px",
            backgroundColor: theme.surface,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            width: "400px",
          }}
        >
          <h2 style={{ color: theme.primary }}>App Settings</h2>

          <label style={{ display: "flex", flexDirection: "column", gap: "4px", color: theme.textPrimary }}>
            Theme:
            <select value={selectedTheme} onChange={handleThemeChange} style={{ padding: "8px" }}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
