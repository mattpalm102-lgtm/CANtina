import React, { useMemo, useState } from "react";
import { useTheme } from "../ThemeContext";
import type { CANFrame } from "../hooks/Websocket";

interface Props {
  frames: CANFrame[];
}

export default function ActiveCANIDsPanel({ frames }: Props) {
  const { theme } = useTheme();

  // Extract sorted unique CAN IDs
  const uniqueIDs = useMemo(() => {
    const set = new Set<number>();
    frames.forEach((f) => set.add(f.id));
    return Array.from(set).sort((a, b) => a - b);
  }, [frames]);

  // Track which IDs are toggled ON
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  const toggleId = (id: number) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: "8px",
        padding: "16px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <h2 style={{ color: theme.accent, marginBottom: "8px" }}>
        Active CAN IDs
      </h2>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {uniqueIDs.length === 0 && (
          <div style={{ color: theme.textSecondary }}>No data yet...</div>
        )}

        {uniqueIDs.map((id) => (
          <div
            key={id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <input
              type="checkbox"
              checked={checkedIds.includes(id)}
              onChange={() => toggleId(id)}
            />
            <span
              style={{
                marginLeft: "8px",
                color: theme.textPrimary,
                fontFamily: "monospace",
              }}
            >
              {id.toString(16).toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
