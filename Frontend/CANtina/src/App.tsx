import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./screens/Home/home";
import PythonIDE from "./screens/Scripting/PythonIDE";
import { ThemeProvider } from "./ThemeContext";

export default function App() {
  return (
    
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/python-ide" element={<PythonIDE />} />
      </Routes>
    </ThemeProvider>
  );
}