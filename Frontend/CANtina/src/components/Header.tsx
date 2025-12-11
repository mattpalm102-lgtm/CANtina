import React from "react";
import { useTheme } from "../ThemeContext";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme } = useTheme();

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        height: "60px",
        backgroundColor: theme.surface,
        borderBottom: `1px solid ${theme.border}`,
        boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
      }}
    >
      <button
        onClick={onMenuClick}
        style={{
          position: "absolute",
          left: "16px",
          width: "36px",
          height: "36px",
          borderRadius: "4px",
          border: "none",
          backgroundColor: theme.primary,
          color: theme.textPrimary,
          cursor: "pointer",
        }}
      >
        ☰
      </button>

      <h1 style={{ color: theme.primary, fontSize: "1.5rem", fontWeight: "bold" }}>
        CANtina
      </h1>
    </header>
  );
}
