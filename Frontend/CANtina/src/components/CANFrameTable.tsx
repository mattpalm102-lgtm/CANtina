import React from "react";
import { useTheme } from "../ThemeContext";
import type { CANFrame } from "../hooks/Websocket";

interface Props {
  frames: CANFrame[];
}

export default function CANFrameTable({ frames }: Props) {
  const { theme } = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: "8px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >

      {/* Header Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr repeat(8, 1fr)",
          padding: "8px",
          borderBottom: `1px solid ${theme.border}`,
          color: theme.textSecondary,
          fontWeight: "bold",
          position: "sticky",
          top: 0,
          backgroundColor: theme.surface,
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center" }}>Timestamp</div>
        <div style={{ textAlign: "center" }}>PGN</div>
        <div style={{ textAlign: "center" }}>CAN ID</div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            D{i}
          </div>
        ))}
      </div>

      {/* Frame List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {frames.map((f, i) => {
          const pgn = (f.id >> 8) & 0xFFFF; // Simple J1939 PGN derivation

          return (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr repeat(8, 1fr)",
                padding: "8px",
                borderBottom: `1px solid ${theme.border}`,
                color: theme.textPrimary,
                textAlign: "center",
              }}
            >
              <div>{f.timestamp.toFixed(3)}</div>
              <div>{pgn}</div>
              <div>{f.id.toString(16).toUpperCase()}</div>

              {f.data.map((byte, j) => (
                <div key={j}>
                  {byte.toString(16).toUpperCase().padStart(2, "0")}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
