// ConnectionPage.tsx
import React, { useState } from "react";
import Header from "../../components/Header";
import SideMenu from "../../components/SideMenu";
import { useTheme } from "../../ThemeContext";
import { useWS } from "../../hooks/WebsocketProvider";

export default function ConnectionPage() {
  const { theme } = useTheme();
  const [deviceType, setDeviceType] = useState<"Peak" | "CANtina">("Peak");
  const [baudRate, setBaudRate] = useState(500000);
  const [termination, setTermination] = useState<"120Ω" | "None">("120Ω");
  const [connectStatus, setConnectStatus] = useState<string>("Not connected");
  const { sendCommand } = useWS();

  const handleConnect = () => {
    sendCommand({
    command: "Connection",
    data: {
        type: "connect",
        deviceType,
        baudRate,
        termination: deviceType === "CANtina" ? termination : undefined,
    }
    });
    setConnectStatus(`Connected to ${deviceType} at ${baudRate} baud`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ display: "flex", flex: 1, justifyContent: "center", padding: "16px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "24px",
            borderRadius: "12px",
            backgroundColor: theme.surface,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            width: "400px",
          }}
        >
          <h2 style={{ color: theme.primary }}>Connection Settings</h2>

          {/* Device Type */}
          <label style={{ color: theme.textPrimary }}> 
            Device Type:
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value as "Peak" | "CANtina")}
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            >
              <option value="Peak">Peak</option>
              <option value="CANtina">CANtina</option>
            </select>
          </label>

          {/* Baud Rate */}
            <label style={{ color: theme.textPrimary }}> 
            Baud Rate:
            <select
                value={baudRate}
                onChange={(e) => setBaudRate(parseInt(e.target.value))}
                style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            >
                {[125000, 250000, 500000, 1000000].map((rate) => (
                <option key={rate} value={rate}>
                    {rate >= 1000 ? `${rate / 1000} k` : rate}bps
                </option>
                ))}
            </select>
            </label>

          {/* CANtina-specific settings */}
          {deviceType === "CANtina" && (
            <>
              <label>
                Termination Resistor:
                <select
                  value={termination}
                  onChange={(e) => setTermination(e.target.value as "120Ω" | "None")}
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                >
                  <option value="120Ω">120Ω</option>
                  <option value="None">None</option>
                </select>
              </label>

            </>
          )}

          {/* Connect Button */}
          <button
            onClick={handleConnect}
            style={{
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: theme.primary,
              color: theme.textPrimary,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Connect
          </button>

          {/* Status */}
          <div style={{ marginTop: "8px", color: theme.textSecondary }}>{connectStatus}</div>
        </div>
      </div>
    </div>
  );
}
