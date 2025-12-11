import React, { useState, useEffect } from "react";
import Editor, { loader } from "@monaco-editor/react";
import { useTheme } from "../../ThemeContext";
import Header from "../../components/Header";
import SideMenu from "../../components/SideMenu";

// Hacky stub to make Monaco show methods in autocomplete
const CANtinaStubHack = `
CANtina = type('CANtina', (), {
    'read': lambda: None,
    'write': lambda can_id, data: None,
    'log': lambda filename: None,
    'stop_log': lambda: None,
    'replay': lambda filename: None,
    'clear': lambda: None
})()
`;

export default function PythonIDE() {
  const { theme, isDark } = useTheme();
  const [code, setCode] = useState(`# Example Python Script\nprint("Hello from CANtina!")\n`);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Inject stub into Monaco for autocomplete
  useEffect(() => {
    loader.init().then(monaco => {
      monaco.languages.python.pythonDefaults.addExtraLib(
        CANtinaStubHack,
        "file:///CANtinaStubHack.py"
      );
    });
  }, []);

  const handleRun = async () => {
    setConsoleOutput(prev => [...prev, "Running script..."]);
    setIsRunning(true);

    try {
      const res = await fetch("http://localhost:8000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (data.stdout) setConsoleOutput(prev => [...prev, ...data.stdout]);
      if (data.stderr) setConsoleOutput(prev => [...prev, ...data.stderr]);
    } catch (err: any) {
      setConsoleOutput(prev => [...prev, `Error: ${err.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem("pythonScript", code);
    setConsoleOutput(prev => [...prev, "Script saved!"]);
  };

  const handleLoad = () => {
    const saved = localStorage.getItem("pythonScript");
    if (saved) {
      setCode(saved);
      setConsoleOutput(prev => [...prev, "Script loaded!"]);
    } else {
      setConsoleOutput(prev => [...prev, "No saved script found."]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header onMenuClick={() => setMenuOpen(!isMenuOpen)} />
      {isMenuOpen && <SideMenu onClose={() => setMenuOpen(false)} />}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", padding: "16px" }}>
        <main style={{ display: "flex", flexDirection: "column", flex: 1, gap: "8px", overflow: "hidden" }}>
          {/* Buttons */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={handleRun} disabled={isRunning}>
              {isRunning ? "Running..." : "Run"}
            </button>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleLoad}>Load</button>
          </div>

          {/* Editor */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <Editor
              height="100%"
              defaultLanguage="python"
              value={code}
              theme={isDark ? "vs-dark" : "light"}
              onChange={(v) => setCode(v || "")}
              options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
            />
          </div>

          {/* Console */}
          <div
            style={{
              height: "150px",
              backgroundColor: theme.background,
              color: theme.textPrimary,
              padding: "8px",
              overflowY: "auto",
              fontFamily: "monospace",
              borderTop: `1px solid ${theme.border}`,
            }}
          >
            {consoleOutput.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
