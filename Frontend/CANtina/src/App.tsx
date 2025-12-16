import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./screens/Home/home";
import PythonIDE from "./screens/Scripting/PythonIDE";
import ConnectionPage from "./screens/Connection/connection";
import SettingsPage from "./screens/Settings/Settings";
import { ThemeProvider } from "./ThemeContext";
import { WebSocketProvider } from "./hooks/WebsocketProvider";
import { SettingsProvider } from "./screens/Settings/SettingsContext";

export default function App() {
  return (
    
    <SettingsProvider>
      <ThemeProvider>
        <WebSocketProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/python-ide" element={<PythonIDE />} />
            <Route path="/connection" element={<ConnectionPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </WebSocketProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}