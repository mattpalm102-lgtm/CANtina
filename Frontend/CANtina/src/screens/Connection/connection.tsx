// ConnectionPage.tsx
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import SideMenu from "../../components/SideMenu";
import { useTheme } from "../../ThemeContext";
import { useWS } from "../../hooks/WebsocketProvider";

const STORAGE_KEY = "connection_page_state";

export default function ConnectionPage() {
  const { theme } = useTheme();
  const { sendCommand } = useWS();

  const handleConnect = () => {
    setConnectStatus(`Connected to ${deviceType} @ ${baudRate}`);
    setIsConnected(true);

    sendCommand({
      command: "Connection",
      data: {
        deviceType,
        baudRate,
        termination,
      },
    });
  };

  const handleDisconnect = () => {
    setConnectStatus("Not connected");
    setIsConnected(false);

    sendCommand({
      command: "Disconnect",
      data: {},
    });
  };

  const savedState = sessionStorage.getItem(STORAGE_KEY);
  const initial = savedState ? JSON.parse(savedState) : {};

  const [deviceType, setDeviceType] = useState<"Peak" | "CANtina">(
    initial.deviceType ?? "Peak"
  );
  const [baudRate, setBaudRate] = useState<number>(
    initial.baudRate ?? 250000
  );
  const [termination, setTermination] = useState<"120Ω" | "None">(
    initial.termination ?? "None"
  );
  const [connectStatus, setConnectStatus] = useState<string>(
    initial.connectStatus ?? "Not connected"
  );
  const [isConnected, setIsConnected] = useState<boolean>(
    initial.isConnected ?? false
  );

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        deviceType,
        baudRate,
        termination,
        connectStatus,
        isConnected,
      })
    );
  }, [deviceType, baudRate, termination, connectStatus, isConnected]);

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
