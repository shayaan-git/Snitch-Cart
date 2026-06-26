import React, { useState } from "react";
import HeaderBar from "../features/shared/components/HeaderBar.jsx";
import { Outlet } from "react-router";

const AppLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <>
      <HeaderBar onMenuClick={() => setMobileSidebarOpen(true)} />
      <Outlet context={{ mobileSidebarOpen, setMobileSidebarOpen }} />
    </>
  );
};

export default AppLayout;

