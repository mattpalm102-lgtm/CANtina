import React from "react";
import { useTheme } from "../ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabs = [
    { label: "Home", path: "/" },
    { label: "Scripting Interface", path: "/python-ide" },
    { label: "Connection", path: "/connection" },
    { label: "Settings", path: "/settings" },
    // Add more tabs as you build more tools
  ];

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        height: "60px",
        backgroundColor: theme.surface,
        borderBottom: `1px solid ${theme.border}`,
        paddingLeft: "16px",
        paddingRight: "16px",
        gap: "16px",
      }}
    >
      <h1 style={{ color: theme.primary, fontSize: "1.4rem", marginRight: "32px" }}>
        CANtina
      </h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "12px" }}>
        {tabs.map(tab => {
          const active = pathname === tab.path;

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              style={{
                padding: "8px 16px",
                border: "none",
                borderBottom: active ? `3px solid ${theme.primary}` : "3px solid transparent",
                backgroundColor: "transparent",
                color: active ? theme.primary : theme.textPrimary,
                fontWeight: active ? "bold" : "normal",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
