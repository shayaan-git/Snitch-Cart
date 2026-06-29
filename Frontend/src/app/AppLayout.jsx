import React, { useState } from "react";
import HeaderBar from "../features/shared/components/HeaderBar.jsx";
import { Outlet } from "react-router";

const AppLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // Lifted here so sidebar state persists when navigating between buyer pages
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <HeaderBar onMenuClick={() => setMobileSidebarOpen(true)} />
      <div className="flex-1 min-h-0 flex overflow-hidden">
        <Outlet
          context={{
            mobileSidebarOpen,
            setMobileSidebarOpen,
            sidebarCollapsed,
            setSidebarCollapsed,
          }}
        />
      </div>
    </div>
  );
};

export default AppLayout;
