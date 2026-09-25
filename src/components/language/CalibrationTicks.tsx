"use client";

import React from "react";

export function CalibrationTicks() {
  return (
    <div className="relative mt-2 flex justify-between items-center px-1 text-[10px] font-mono text-zinc-500 select-none">
      <div className="flex flex-col items-center">
        <span className="h-1 w-px bg-zinc-700" />
        <span className="mt-0.5">0%</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="h-1 w-px bg-zinc-700" />
        <span className="mt-0.5">25%</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="h-1.5 w-px bg-cyan-500/60" />
        <span className="mt-0.5 text-zinc-400">50%</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="h-1 w-px bg-zinc-700" />
        <span className="mt-0.5">75%</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="h-1 w-px bg-zinc-700" />
        <span className="mt-0.5">100%</span>
      </div>
    </div>
  );
}
