"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  title: string;
  subtitle?: {
    text: string;
    className?: string;
  };
  children?: React.ReactNode;
  backRoute?: string;
}

export function DashboardHeader({
  title,
  subtitle,
  children,
  backRoute,
}: DashboardHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backRoute) {
      router.push(backRoute);
    } else {
      router.back();
    }
  };

  return (
    <div className="bg-white flex justify-between items-center p-4">
      <div className="flex items-center gap-4">
        {backRoute && (
          <ArrowLeft
            className="w-4 h-4 text-gray-500 cursor-pointer"
            onClick={handleBack}
          />
        )}
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
