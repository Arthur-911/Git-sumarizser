"use client";

import React from "react";

export function SparkleBurst() {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center z-30">
      {angles.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const tx = Math.cos(rad) * 16;
        const ty = Math.sin(rad) * 16;
        return (
          <span
            key={i}
            style={
              {
                "--tx": `${tx}px`,
                "--ty": `${ty}px`,
              } as React.CSSProperties
            }
            className="absolute h-1 w-1 rounded-full bg-cyan-300 animate-sparkle-burst"
          />
        );
      })}
    </span>
  );
}
