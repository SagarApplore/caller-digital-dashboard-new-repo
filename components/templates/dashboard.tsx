"use client";

import { Sidebar } from "../sidebar";
import { DashboardHeader } from "../dashboard-header";

interface DashboardProps {
  children?: React.ReactNode;
}

export default function Dashboard({ children }: DashboardProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-hidden transition-all duration-200">
          {children}
        </div>
      </div>
    </div>
  );
}
