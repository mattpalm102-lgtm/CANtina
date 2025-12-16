import React, { useMemo, useState, useEffect, useRef } from "react";
import Header from "../../components/Header";
import CANFrameTable from "../../components/CANFrameTable";
import ActiveCANIDsPanel from "../../components/ActiveCANIDsPanel";
import { useWS } from "../../hooks/WebsocketProvider";
import type { CANFrame } from "../../hooks/Websocket";
import CANToolboxPanel from "../../components/CANToolboxPanel";
import type { ViewMode } from "../../components/CANToolboxPanel";

export default function Home() {
  const { frames } = useWS();
  const { sendCommand } = useWS();

  const [enabledIds, setEnabledIds] = useState<number[]>([]);
  const [isLogging, setIsLogging] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("stream");

  const [clearEpoch, setClearEpoch] = useState(0);
  const seenIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    setEnabledIds((prev) => {
      const next = new Set(prev);
      let changed = false;

      for (const f of frames) {
        if (f._seq < clearEpoch) continue;

        if (!seenIdsRef.current.has(f.id)) {
          seenIdsRef.current.add(f.id);
          next.add(f.id);
          changed = true;
        }
      }

      return changed ? Array.from(next) : prev;
    });
  }, [frames, clearEpoch]);

  const visibleFrames = useMemo<CANFrame[]>(() => {
    return frames.filter((f: CANFrame) => f._seq >= clearEpoch);
  }, [frames, clearEpoch]);

  const filteredFrames = useMemo<CANFrame[]>(() => {
    if (enabledIds.length === 0) return [];
    return visibleFrames.filter((f) => enabledIds.includes(f.id));
  }, [visibleFrames, enabledIds]);

  const latestFrames = useMemo<CANFrame[]>(() => {
    if (enabledIds.length === 0) return [];

    const map = new Map<number, CANFrame>();

    for (const f of visibleFrames) {
      if (enabledIds.includes(f.id)) {
        map.set(f.id, f);
      }
    }

    return Array.from(map.values());
  }, [visibleFrames, enabledIds]);

  const handleStartLog = () => {
    console.log("Logging started");
    setIsLogging(true);
    sendCommand({
      command: "start_log",
      data: {
        timestamp: Date.now(),
      }
    });
  };

  const handleStopLog = () => {
    console.log("Logging stopped");
    setIsLogging(false);
    sendCommand({
      command: "stop_log",
      data: {
        timestamp: Date.now(),
      }
    });
  };

  const handleSaveLog = async () => {
    sendCommand({
      command: "save_log",
      data: {
        timestamp: Date.now(),
      }
    });
  };

  const handleClearFrames = () => {
    console.log("Clearing frames");

    const lastSeq = frames.length
      ? frames[frames.length - 1]._seq
      : 0;

    setClearEpoch(lastSeq + 1);

    setEnabledIds([]);
    seenIdsRef.current.clear();
  };
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
        <div style={{ flex: 3, height: "100%", overflow: "hidden" }}>
          <CANFrameTable
            frames={viewMode === "stream" ? filteredFrames : latestFrames}
            autoScroll={autoScroll}
            viewMode={viewMode}
          />
        </div>

        <div
          style={{
            flex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            overflow: "hidden",
          }}
        >
          <CANToolboxPanel
            isLogging={isLogging}
            hasFrames={visibleFrames.length > 0}
            autoScroll={autoScroll}
            viewMode={viewMode}
            onStartLog={handleStartLog}
            onStopLog={handleStopLog}
            onSaveLog={handleSaveLog}
            onClearFrames={handleClearFrames}
            onToggleAutoScroll={setAutoScroll}
            onChangeViewMode={setViewMode}
          />

          <div style={{ flex: 1, overflowY: "auto" }}>
            <ActiveCANIDsPanel
              frames={visibleFrames}
              enabledIds={enabledIds}
              setEnabledIds={setEnabledIds}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
