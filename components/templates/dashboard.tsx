"use client";

import { Sidebar } from "../sidebar";
import { DashboardHeader } from "../dashboard-header";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface DashboardProps {
  header: {
    title: string;
    subtitle?: {
      text: string;
      className?: string;
    };
    backRoute?: string;
    children?: React.ReactNode;
  };
  children: React.ReactNode;
}

export default function Dashboard({ children, header }: DashboardProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title={header.title}
          subtitle={header.subtitle}
          backRoute={header.backRoute}
          children={header.children}
        />
        <div className="flex-1 overflow-auto transition-all duration-200">
          {children}
        </div>
      </div>
    </div>
  );
}
