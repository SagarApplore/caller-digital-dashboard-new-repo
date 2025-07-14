"use client";

import { useEffect, useRef, useState } from "react";

interface AudioVisualizerProps {
  isActive: boolean;
  className?: string;
  barCount?: number;
}

export default function AudioVisualizer({ 
  isActive, 
  className = "", 
  barCount = 5 
}: AudioVisualizerProps) {
  const [barHeights, setBarHeights] = useState<number[]>(Array(barCount).fill(10));
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isActive) {
      setBarHeights(Array(barCount).fill(10));
      return;
    }

    const animate = () => {
      setBarHeights(
        Array(barCount).fill(0).map(() => 
          Math.random() * 60 + 10
        )
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, barCount]);

  return (
    <div className={`flex items-end justify-center space-x-1 h-32 ${className}`}>
      {barHeights.map((height, index) => (
        <div
          key={index}
          className="w-2 bg-gradient-to-t from-green-400 to-green-600 rounded-full transition-all duration-100 ease-out"
          style={{
            height: `${height}px`,
            animationDelay: `${index * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
} 