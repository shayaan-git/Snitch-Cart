import React, { useState } from "react";
import HeaderBar from "../features/shared/components/HeaderBar.jsx";
import { Outlet } from "react-router";

const AppLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // Lifted here so sidebar state persists when navigating between buyer pages
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <>
      <HeaderBar onMenuClick={() => setMobileSidebarOpen(true)} />
      <Outlet
        context={{
          mobileSidebarOpen,
          setMobileSidebarOpen,
          sidebarCollapsed,
          setSidebarCollapsed,
        }}
      />
    </>
  );
};

export default AppLayout;

