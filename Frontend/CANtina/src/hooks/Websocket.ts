import { useEffect, useRef, useState } from "react";

export interface CANFrame {
  id: number;
  dlc: number;
  data: number[];
  timestamp: number;
}

export function useWebSocket(url: string) {
  const [frames, setFrames] = useState<CANFrame[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        // Handle CAN frames
        if (msg.command === "can_frame") {
          console.log("Received CAN frame:", msg);
          //const frame: CANFrame = msg;
          //setFrames(prev => [frame, ...prev].slice(0, 200));
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
