import React, { useState } from "react";
import Header from "../../components/Header";
import SideMenu from "../../components/SideMenu";
import CANFrameTable from "../../components/CANFrameTable";
import ActiveCANIDsPanel from "../../components/ActiveCANIDsPanel";

export default function Home() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Header onMenuClick={() => setMenuOpen(!isMenuOpen)} />
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {isMenuOpen && <SideMenu onClose={() => setMenuOpen(false)} />}
          <main style={{ display: "flex", flex: 1, gap: "16px", padding: "16px", overflow: "hidden" }}>
            <div style={{ flex: 3, height: "100%", overflowY: "auto" }}>
              <CANFrameTable />
            </div>
            <div style={{ flex: 1, height: "100%", overflowY: "auto" }}>
              <ActiveCANIDsPanel />
            </div>
          </main>
        </div>
      </div>
  );
}
