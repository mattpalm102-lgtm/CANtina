import { useEffect, useRef, useState } from "react";

export interface CANFrame {
  id: number;
  dlc: number;
  data: number[];
  timestamp: number;
  _seq: number;
}

let seq = 0;

export function useWebSocket(url: string) {
  const [frames, setFrames] = useState<CANFrame[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data);
        switch (msg.command) {
          case "can_frame":
            const frame: CANFrame = msg.data;
            setFrames(prev => [
              ...prev,
              { ...frame, _seq: seq++ }
            ]);
            break;
          case "log_data":
            await handleLogData(msg.data);
            break;

          default:
            console.warn("Unknown WS message:", msg);
            break;
        }

        // Handle responses / status messages if needed
        // if (msg.type === "status") ...
      } catch (err) {
        console.error("Invalid WS message:", err);
      }
    };

    ws.onclose = () => console.log("WebSocket disconnected");
    ws.onerror = (e) => console.error("WebSocket error:", e);

    return () => ws.close();
  }, [url]);

  // Send JSON command to device
  function sendCommand(cmd: any) {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(cmd));
    } else {
      console.warn("WS not open, failed to send", cmd);
    }
  }

  return { frames, sendCommand };
}

async function handleLogData(data: {
  filename: string;
  csv: string;
}) {
  if (!data.csv) {
    console.warn("Received empty log");
    return;
  }

  const blob = new Blob([data.csv], {
    type: "text/csv",
  });

  const handle = await (window as any).showSaveFilePicker({
    suggestedName: data.filename ?? "cantina_log.csv",
    types: [
      {
        description: "CSV Files",
        accept: { "text/csv": [".csv"] },
      },
    ],
  });

  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
}
