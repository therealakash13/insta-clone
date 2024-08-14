import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";

export default function MainLayout() {
  return (
    <div>
      <LeftSidebar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
