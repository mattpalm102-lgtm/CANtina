import React, {} from "react";
import { useWebSocket } from "./Websocket";

const WSContext = React.createContext<any>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const ws = useWebSocket("ws://localhost:8001/ws");
  return <WSContext.Provider value={ws}>{children}</WSContext.Provider>;
}

export const useWS = () => React.useContext(WSContext);