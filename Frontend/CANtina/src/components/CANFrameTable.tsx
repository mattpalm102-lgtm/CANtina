import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../ThemeContext";
import type { CANFrame } from "../hooks/Websocket";

interface Props {
  frames: CANFrame[];
  autoScroll?: boolean;
  viewMode?: "stream" | "latest";
}

export default function CANFrameTable({
  frames,
  autoScroll,
  viewMode = "stream",
}: Props) {
  const { theme } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewMode !== "latest") {
      setFlashMap(new Map());
      prevFramesRef.current.clear();
    }
  }, [viewMode]);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [frames, autoScroll]);

  const prevFramesRef = useRef<Map<number, CANFrame>>(new Map());

  const [flashMap, setFlashMap] = useState<
    Map<string, number>
  >(new Map());

  useEffect(() => {
    if (viewMode !== "latest") return;

    const now = Date.now();
    const newFlash = new Map(flashMap);

    for (const f of frames) {
      const prev = prevFramesRef.current.get(f.id);
      if (!prev) continue;

      f.data.forEach((byte, i) => {
        if (byte !== prev.data[i]) {
          newFlash.set(`${f.id}-${i}`, now);
        }
      });
    }

    setFlashMap(newFlash);

    for (const f of frames) {
      prevFramesRef.current.set(f.id, f);
    }
  }, [frames, viewMode]);

  useEffect(() => {
    if (flashMap.size === 0) return;

    const timer = setTimeout(() => {
      const cutoff = Date.now() - 1000;

      setFlashMap((prev) => {
        const next = new Map(prev);
        for (const [key, ts] of next) {
          if (ts < cutoff) next.delete(key);
        }
        return next;
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [flashMap]);

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

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {frames.map((f) => {
          const pf = (f.id >> 16) & 0xff;
          const ps = (f.id >> 8) & 0xff;
          const dp = (f.id >> 24) & 0x01;

          const pgn =
            pf < 240
              ? (dp << 16) | (pf << 8)
              : (dp << 16) | (pf << 8) | ps;

          return (
            <div
              key={f._seq}
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
              <div>{`0x${pgn
                .toString(16)
                .toUpperCase()
                .padStart(4, "0")}`}</div>
              <div>{`0x${f.id
                .toString(16)
                .toUpperCase()
                .padStart(8, "0")}`}</div>

              {f.data.map((byte, i) => {
                const flashKey = `${f.id}-${i}`;
                const flashTs = flashMap.get(flashKey);
                const age = flashTs ? Date.now() - flashTs : Infinity;
                const alpha =
                  age < 1000 ? 1 - age / 1000 : 0;

                return (
                  <div
                    key={i}
                    style={{
                      backgroundColor:
                        alpha > 0
                          ? `rgba(255,255,255,${0.35 * alpha})`
                          : "transparent",
                      transition: "background-color 100ms linear",
                      borderRadius: "4px",
                    }}
                  >
                    {`0x${byte
                      .toString(16)
                      .toUpperCase()
                      .padStart(2, "0")}`}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
