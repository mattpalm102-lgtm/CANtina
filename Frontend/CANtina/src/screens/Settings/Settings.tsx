import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useTheme } from "../../ThemeContext";
import { useSettings } from "./SettingsContext";

export default function SettingsPage() {
  const { theme } = useTheme();
  const { settings, setTheme } = useSettings();

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as "dark" | "light");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />

      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          padding: "16px",
        }}
      >
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

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              color: theme.textPrimary,
            }}
          >
            Theme:
            <select
              value={settings.theme}
              onChange={handleThemeChange}
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
