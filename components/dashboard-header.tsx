"use client";

import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title: string;
  subtitle?: {
    text: string;
    className?: string;
  };
  children?: React.ReactNode;
}

export function DashboardHeader({
  title,
  subtitle,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="bg-white flex justify-between items-center p-4">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {subtitle && (
          <h2
            className={cn(
              "text-xs px-2 py-1 rounded-full font-semibold",
              subtitle.className
            )}
          >
            {subtitle.text}
          </h2>
        )}
      </div>
      {children}
    </div>
  );
}
