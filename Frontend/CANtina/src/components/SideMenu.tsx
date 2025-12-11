import React from "react";
import { useTheme } from "../ThemeContext";
import { useNavigate } from "react-router-dom";

interface SideMenuProps {
  onClose: () => void;
}

export default function SideMenu({ onClose }: SideMenuProps) {
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Frame Sniffer", path: "/" },
    { name: "Python IDE", path: "/python-ide" },
    { name: "Fuzzing Interface", path: "/fuzzing" },
    { name: "Light/Dark Mode" },
    { name: "Language Selection" },
    { name: "Log CAN Data" },
    { name: "Replay / Send Custom Frames" },
    { name: "Other CAN Tools" },
  ];

  const handleMenuClick = (item: typeof menuItems[number]) => {
    if (item.name === "Light/Dark Mode") {
      toggleTheme();
    } else if (item.path) {
      navigate(item.path);
    } else {
      console.log("Clicked:", item.name);
    }
    onClose();
  };

  return (
    <div
      style={{
        width: "250px",
        backgroundColor: theme.surface,
        borderRight: `1px solid ${theme.border}`,
        display: "flex",
        flexDirection: "column",
        padding: "16px",
      }}
    >
      <button
        onClick={onClose}
        style={{
          marginBottom: "16px",
          padding: "8px",
          border: "none",
          cursor: "pointer",
          backgroundColor: theme.primary,
          color: theme.textPrimary,
        }}
      >
        Close
      </button>

      {menuItems.map((item) => (
        <button
          key={item.name}
          onClick={() => handleMenuClick(item)}
          style={{
            padding: "8px",
            marginBottom: "8px",
            border: "none",
            borderRadius: "4px",
            backgroundColor: theme.secondary,
            color: theme.textPrimary,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          {item.name} {item.name === "Light/Dark Mode" ? `(${isDark ? "Dark" : "Light"})` : ""}
        </button>
      ))}
    </div>
  );
}
