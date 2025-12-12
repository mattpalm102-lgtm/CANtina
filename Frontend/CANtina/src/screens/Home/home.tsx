import React, { useState } from "react";
import Header from "../../components/Header";
import CANFrameTable from "../../components/CANFrameTable";
import ActiveCANIDsPanel from "../../components/ActiveCANIDsPanel";
import { useWebSocket } from "../../hooks/Websocket";

export default function Home() {
  const { frames, sendCommand } = useWebSocket("ws://localhost:8001");

  const [termination, setTermination] = useState(false);

  const toggleTermination = () => {
    const next = !termination;
    setTermination(next);
    sendCommand({ command: "set_termination", enable: next });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />

      {/* Control Bar */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
      </div>

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
          <CANFrameTable frames={frames} />
        </div>

        <div style={{ flex: 1, height: "100%", overflowY: "auto" }}>
          <ActiveCANIDsPanel frames={frames} />
        </div>
      </main>
    </div>
  );
}
