import React, { useRef } from "react";
import { useTheme } from "../ThemeContext";

export type ViewMode = "stream" | "latest";

interface Props {
  isLogging: boolean;
  hasFrames: boolean;
  autoScroll: boolean;
  viewMode: ViewMode;

  onStartLog: () => void;
  onStopLog: () => void;
  onSaveLog: () => void;

  onClearFrames: () => void;
  onToggleAutoScroll: (v: boolean) => void;
  onChangeViewMode: (m: ViewMode) => void;
}

export default function CANToolboxPanel({
  isLogging,
  hasFrames,
  autoScroll,
  viewMode,
  onStartLog,
  onStopLog,
  onSaveLog,
  onClearFrames,
  onToggleAutoScroll,
  onChangeViewMode,
}: Props) {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const buttonBase: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: `1px solid ${theme.border}`,
    backgroundColor: theme.background,
    color: theme.textPrimary,
    cursor: "pointer",
    fontSize: "0.9rem",
  };

  return (
    <div
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: "10px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <h2 style={{ color: theme.accent, marginBottom: "2px" }}>
        Toolbox
      </h2>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {!isLogging ? (
          <button
            style={{
              ...buttonBase,
              borderColor: theme.primary,
              color: theme.primary,
              fontWeight: 600,
            }}
            onClick={onStartLog}
          >
            Start Logging
          </button>
        ) : (
          <button
            style={{
              ...buttonBase,
              borderColor: theme.accent,
              color: theme.accent,
              fontWeight: 600,
            }}
            onClick={onStopLog}
          >
            Stop Logging
          </button>
        )}

        <button
          style={{
            ...buttonBase,
            opacity: hasFrames ? 1 : 0.4,
            cursor: hasFrames ? "pointer" : "not-allowed",
          }}
          disabled={!hasFrames}
          onClick={onSaveLog}
        >
          Save Log…
        </button>
      </div>

      <div
        style={{
          display: "flex",
          border: `1px solid ${theme.border}`,
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {(["stream", "latest"] as ViewMode[]).map((mode) => {
          const active = viewMode === mode;
          return (
            <button
              key={mode}
              onClick={() => onChangeViewMode(mode)}
              style={{
                flex: 1,
                padding: "8px",
                border: "none",
                backgroundColor: active
                  ? theme.background
                  : theme.surface,
                color: active
                  ? theme.primary
                  : theme.textPrimary,
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
              }}
            >
              {mode === "stream"
                ? "All Frames"
                : "Overwrite Mode"}
            </button>
          );
        })}
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.9rem",
          color: theme.textPrimary,
        }}
      >
        <input
          type="checkbox"
          checked={autoScroll}
          onChange={(e) => onToggleAutoScroll(e.target.checked)}
        />
        Auto-scroll frames
      </label>

      <button
        onClick={onClearFrames}
        style={{
          ...buttonBase,
          width: "100%",
          color: "#ff6b6b",
          borderColor: "#ff6b6b",
        }}
      >
        🗑 Clear Frames
      </button>
    </div>
  );
}
