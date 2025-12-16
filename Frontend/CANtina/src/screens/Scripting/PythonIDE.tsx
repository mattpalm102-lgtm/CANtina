import React, { useState, useEffect } from "react";
import Editor, { loader } from "@monaco-editor/react";
import { useTheme } from "../../ThemeContext";
import Header from "../../components/Header";

const DEFAULT_CODE = `# Example Python Script\nprint(read())\n`;

export default function PythonIDE() {
  const { theme, isDark } = useTheme();
  const [isRunning, setIsRunning] = useState(false);

  const [code, setCode] = useState(
    () => sessionStorage.getItem("python_code") ?? DEFAULT_CODE
  );

  useEffect(() => {
    sessionStorage.setItem("python_code", code);
  }, [code]);

  const [consoleOutput, setConsoleOutput] = useState<string[]>(
    () => JSON.parse(sessionStorage.getItem("python_console") ?? "[]")
  );

  useEffect(() => {
    sessionStorage.setItem(
      "python_console",
      JSON.stringify(consoleOutput)
    );
  }, [consoleOutput]);

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

  const handleSave = async () => {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: "user_script.py",
        types: [
          {
            description: "Python Script",
            accept: { "text/x-python": [".py"] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(code);
      await writable.close();

      setConsoleOutput(prev => [...prev, "Saved to file system"]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoad = async () => {
    try {
      const [fileHandle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: "Python Script",
            accept: { "text/x-python": [".py"] },
          },
        ],
        multiple: false,
      });

      const file = await fileHandle.getFile();
      const contents = await file.text();
      setCode(contents);

      setConsoleOutput(prev => [...prev, `Loaded ${file.name}`]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearConsole = () => {
    setConsoleOutput([]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />

      <div style={{ display: "flex", flex: 1, overflow: "hidden", padding: "16px" }}>
        <main style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

          {/* VS Code Style Editor Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "6px 10px",
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderBottom: "none",
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px",
            }}
          >
            <span style={{ color: theme.textSecondary, fontSize: "0.9rem" }}>
              User_Script.py
            </span>

            <div style={{ display: "flex", gap: "12px" }}>
              
              {/* Clear Console */}
              <button
                onClick={handleClearConsole}
                title="Clear Console"
                style={{
                  fontSize: "1.2rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: theme.textSecondary,
                }}
              >
                🧹
              </button>

              {/* Load */}
              <button
                onClick={handleLoad}
                title="Load Script"
                style={{
                  fontSize: "1.2rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: theme.textPrimary,
                }}
              >
                📂
              </button>

              {/* Save */}
              <button
                onClick={handleSave}
                title="Save Script"
                style={{
                  fontSize: "1.2rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: theme.textPrimary,
                }}
              >
                💾
              </button>

              {/* Run */}
              <button
                onClick={handleRun}
                disabled={isRunning}
                title="Run Script"
                style={{
                  fontSize: "1.2rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  opacity: isRunning ? 0.5 : 1,
                  color: theme.primary,
                }}
              >
                ▶️
              </button>
            </div>
          </div>

          {/* Editor */}
          <div style={{ flex: 1, border: `1px solid ${theme.border}`, borderTop: "none" }}>
            <Editor
              height="100%"
              defaultLanguage="python"
              value={code}
              theme={isDark ? "vs-dark" : "light"}
              onChange={(v) => setCode(v || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Console */}
          <div
            style={{
              height: "160px",
              backgroundColor: theme.background,
              color: theme.textPrimary,
              padding: "8px",
              overflowY: "auto",
              fontFamily: "monospace",
              borderTop: `1px solid ${theme.border}`,
              marginTop: "8px",
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
