import React, { useMemo, useState, useEffect, useRef } from "react";
import Header from "../../components/Header";
import CANFrameTable from "../../components/CANFrameTable";
import ActiveCANIDsPanel from "../../components/ActiveCANIDsPanel";
import { useWS } from "../../hooks/WebsocketProvider";
import type { CANFrame } from "../../hooks/Websocket";

export default function Home() {
  const { frames } = useWS();

  // IDs that are ENABLED (checked)
  const [enabledIds, setEnabledIds] = useState<number[]>([]);
  const seenIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    setEnabledIds((prev) => {
      const next = new Set(prev);
      let changed = false;

      for (const f of frames) {
        if (!seenIdsRef.current.has(f.id)) {
          // First time this ID has EVER been seen
          seenIdsRef.current.add(f.id);
          next.add(f.id); // auto-enable once
          changed = true;
        }
      }

      return changed ? Array.from(next) : prev;
    });
  }, [frames]);

  // Filter frames WITHOUT changing order
  const filteredFrames = useMemo<CANFrame[]>(() => {
    if (enabledIds.length === 0) return [];
    return frames.filter((f: CANFrame) => enabledIds.includes(f.id));
  }, [frames, enabledIds]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />

      <main
        style={{
          display: "flex",
          flex: 1,
          gap: "16px",
          padding: "16px",
          overflow: "hidden",
        }}
      >
        <div style={{ flex: 3, height: "100%", overflowY: "auto" }}>
          <CANFrameTable frames={filteredFrames} />
        </div>

        <div style={{ flex: 1, height: "100%", overflowY: "auto" }}>
          <ActiveCANIDsPanel
            frames={frames}
            enabledIds={enabledIds}
            setEnabledIds={setEnabledIds}
          />
        </div>
      </main>
    </div>
  );
}
