import { useEffect, useState } from "react";

export interface CANFrame {
  id: number;
  dlc: number;
  data: number[];
  timestamp: number;
}

export function useWebSocket(url: string) {
  const [frames, setFrames] = useState<CANFrame[]>([]);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      const frame: CANFrame = JSON.parse(event.data);
      setFrames(prev => [frame, ...prev].slice(0, 200)); // keep last 200 frames
    };

    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [url]);

  return frames;
}
