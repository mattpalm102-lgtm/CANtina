import React, { useState } from "react";
import { useTheme } from "../ThemeContext";

const mockCANIDs = [0x18FEF100, 0x18FEF200, 0x18FEF300];

export default function ActiveCANIDsPanel() {
  const { theme } = useTheme();
  const [checkedIds, setCheckedIds] = useState<number[]>(mockCANIDs);

  const toggleId = (id: number) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "16px", height: "100%" }}>
      <h2 style={{ color: theme.accent, marginBottom: "8px" }}>Active CAN IDs</h2>
      {mockCANIDs.map((id) => (
        <div key={id} style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
          <input
            type="checkbox"
            checked={checkedIds.includes(id)}
            onChange={() => toggleId(id)}
          />
          <span style={{ marginLeft: "8px", color: theme.textPrimary }}>{id.toString(16).toUpperCase()}</span>
        </div>
      ))}
    </div>
  );
}
