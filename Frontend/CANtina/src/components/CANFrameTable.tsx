import React from "react";
import { useTheme } from "../ThemeContext";

const mockFrames = [
  { timestamp: 0.123, pgn: 65265, canId: 0x18FEF100, data: [0, 1, 2, 3, 4, 5, 6, 7] },
  { timestamp: 0.456, pgn: 65266, canId: 0x18FEF200, data: [7, 6, 5, 4, 3, 2, 1, 0] },
  { timestamp: 0.456, pgn: 65266, canId: 0x18FEF300, data: [7, 6, 5, 4, 3, 2, 1, 0] },
  { timestamp: 0.456, pgn: 65266, canId: 0x18FEF100, data: [7, 6, 5, 4, 3, 2, 1, 0] },
  { timestamp: 0.456, pgn: 65266, canId: 0x18FEF200, data: [7, 6, 5, 4, 3, 2, 1, 0] },
  { timestamp: 0.456, pgn: 65266, canId: 0x18FEF300, data: [7, 6, 5, 4, 3, 2, 1, 0] },
  { timestamp: 0.456, pgn: 65266, canId: 0x18FEF100, data: [7, 6, 5, 4, 3, 2, 1, 0] },
  { timestamp: 0.456, pgn: 65266, canId: 0x18FEF200, data: [7, 6, 5, 4, 3, 2, 1, 0] },
  { timestamp: 0.456, pgn: 65266, canId: 0x18FEF300, data: [7, 6, 5, 4, 3, 2, 1, 0] },
  { timestamp: 0.456, pgn: 65266, canId: 0x18FEF100, data: [7, 6, 5, 4, 3, 2, 1, 0] },
  { timestamp: 0.456, pgn: 65266, canId: 0x18FEF200, data: [7, 6, 5, 4, 3, 2, 1, 0] },
  { timestamp: 0.456, pgn: 65266, canId: 0x18FEF300, data: [7, 6, 5, 4, 3, 2, 1, 0] },
];

export default function CANFrameTable() {
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
      {/* Header */}
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

      {/* Body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {mockFrames.map((f, i) => (
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
            <div>{f.pgn}</div>
            <div>{f.canId.toString(16).toUpperCase()}</div>
            {f.data.map((byte, j) => (
              <div key={j}>{byte.toString(16).toUpperCase().padStart(2, "0")}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
