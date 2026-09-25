"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { LanguageStat } from "@/types/github";
import {
  WavePoint,
  Bubble,
  initPoints,
  initBubbles,
  updateSprings,
  applyMouseImpulse,
  findLanguageAtPercent,
} from "./language/liquidPhysics";

interface LiquidLanguageBarProps {
  languages: LanguageStat[];
  selectedLanguage?: string | null;
  onSelectLanguage?: (lang: string | null) => void;
  onHoverLanguage?: (lang: LanguageStat | null, posPercent: number | null) => void;
}

export function LiquidLanguageBar({
  languages,
  selectedLanguage,
  onSelectLanguage,
  onHoverLanguage,
}: LiquidLanguageBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const animFrameId = useRef<number | null>(null);
  const pointsRef = useRef<WavePoint[]>([]);
  const bubblesRef = useRef<Bubble[]>([]);
  const lastMousePos = useRef<{ x: number; y: number; time: number } | null>(null);

  const numPoints = 100;
  const restingY = 7;

  useEffect(() => {
    bubblesRef.current = initBubbles(16);
  }, []);

  const handleInitPoints = useCallback(
    (width: number) => {
      pointsRef.current = initPoints(width, numPoints, restingY);
    },
    [restingY]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const updateDimensions = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
      handleInitPoints(width);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    let clock = 0;

    const render = () => {
      clock += 0.014;
      const pts = pointsRef.current;

      updateSprings(pts, numPoints, restingY, clock);

      ctx.clearRect(0, 0, width, height);

      let cumulativePercent = 0;
      const boundaries: { lang: LanguageStat; xStart: number; xEnd: number }[] = [];

      languages.forEach((lang) => {
        const startX = (cumulativePercent / 100) * width;
        cumulativePercent += lang.percentage;
        const endX = (cumulativePercent / 100) * width;
        boundaries.push({ lang, xStart: startX, xEnd: endX });
      });

      // Draw liquid segments
      boundaries.forEach(({ lang, xStart, xEnd }) => {
        const isSelected = selectedLanguage === lang.name;
        const isDimmed = selectedLanguage && !isSelected;

        const startIndex = Math.max(0, Math.floor((xStart / width) * (numPoints - 1)));
        const endIndex = Math.min(numPoints - 1, Math.ceil((xEnd / width) * (numPoints - 1)));

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xStart, height);

        const startY = pts[startIndex] ? pts[startIndex].y : restingY;
        ctx.lineTo(xStart, startY);

        for (let i = startIndex; i <= endIndex; i++) {
          const pt = pts[i];
          if (pt) {
            ctx.lineTo(pt.x, pt.y);
          }
        }

        const endY = pts[endIndex] ? pts[endIndex].y : restingY;
        ctx.lineTo(xEnd, endY);
        ctx.lineTo(xEnd, height);
        ctx.closePath();

        const fluidGrad = ctx.createLinearGradient(0, 0, 0, height);
        if (isDimmed) {
          fluidGrad.addColorStop(0, `${lang.color}33`);
          fluidGrad.addColorStop(1, `${lang.color}15`);
        } else if (isSelected) {
          fluidGrad.addColorStop(0, "#ffffff");
          fluidGrad.addColorStop(0.2, lang.color);
          fluidGrad.addColorStop(1, `${lang.color}cc`);
        } else {
          fluidGrad.addColorStop(0, `${lang.color}ee`);
          fluidGrad.addColorStop(0.5, lang.color);
          fluidGrad.addColorStop(1, `${lang.color}bb`);
        }

        ctx.fillStyle = fluidGrad;
        ctx.fill();

        if (isSelected) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.8;
          ctx.shadowColor = lang.color;
          ctx.shadowBlur = 14;
          ctx.stroke();
        }

        ctx.restore();

        if (xEnd < width - 1) {
          ctx.save();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(xEnd, endY);
          ctx.lineTo(xEnd, height);
          ctx.stroke();
          ctx.restore();
        }
      });

      // Surface meniscus wave
      ctx.save();
      ctx.beginPath();
      if (pts.length > 0) {
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x, pts[i].y);
        }
      }
      ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.restore();

      // Render floating micro-bubbles
      const bubbles = bubblesRef.current;
      bubbles.forEach((b) => {
        b.phase += b.wobbleSpeed * 0.012;
        const currentX = (b.x + Math.sin(b.phase) * b.wobbleAmp) * width;
        const currentY = b.yRatio * height + Math.cos(b.phase) * 1.2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(currentX, currentY, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();
      });

      // Typography for wide segments
      boundaries.forEach(({ lang, xStart, xEnd }) => {
        const segWidth = xEnd - xStart;
        if (segWidth >= 65) {
          const midX = (xStart + xEnd) / 2;
          const ptIdx = Math.floor((midX / width) * (numPoints - 1));
          const waveY = pts[ptIdx] ? pts[ptIdx].y : restingY;
          const textY = (waveY + height) / 2 + 3.5;

          ctx.save();
          ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
          ctx.textAlign = "center";
          ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
          ctx.shadowBlur = 4;
          ctx.shadowOffsetY = 1;
          ctx.fillStyle = "#ffffff";

          const label =
            segWidth >= 110
              ? `${lang.name} ${lang.percentage}%`
              : `${lang.percentage}%`;

          ctx.fillText(label, midX, textY);
          ctx.restore();
        }
      });

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [languages, selectedLanguage, handleInitPoints, restingY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const currentTime = performance.now();

    const normalizedX = Math.max(0, Math.min(1, x / width));
    const percent = normalizedX * 100;

    const hovered = findLanguageAtPercent(languages, percent);
    if (onHoverLanguage) {
      onHoverLanguage(hovered, percent);
    }

    if (lastMousePos.current) {
      const dt = Math.max(10, currentTime - lastMousePos.current.time);
      const dx = x - lastMousePos.current.x;
      const speed = Math.min(Math.abs(dx) / dt, 2.0);

      applyMouseImpulse(pointsRef.current, numPoints, normalizedX, dx, speed);
    }

    lastMousePos.current = { x, y, time: currentTime };
  };

  const handleMouseLeave = () => {
    lastMousePos.current = null;
    if (onHoverLanguage) {
      onHoverLanguage(null, null);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !onSelectLanguage) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const normalizedX = Math.max(0, Math.min(1, x / rect.width));
    const percent = normalizedX * 100;

    const clickedLang = findLanguageAtPercent(languages, percent);
    if (clickedLang) {
      if (selectedLanguage === clickedLang.name) {
        onSelectLanguage(null);
      } else {
        onSelectLanguage(clickedLang.name);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="group relative h-9 w-full rounded-2xl bg-zinc-950/90 border border-zinc-700/80 p-1 shadow-[inset_0_3px_10px_rgba(0,0,0,0.9),0_2px_12px_rgba(0,0,0,0.5)] cursor-pointer select-none overflow-hidden transition-all duration-300 hover:border-zinc-500/80 hover:shadow-[0_0_24px_rgba(6,182,212,0.2),inset_0_3px_10px_rgba(0,0,0,0.9)]"
    >
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-2xl z-20" />
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white/10 to-transparent pointer-events-none rounded-b-2xl z-20" />
      <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/40 to-transparent pointer-events-none z-20" />
      <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/40 to-transparent pointer-events-none z-20" />

      <canvas
        ref={canvasRef}
        className="w-full h-full block rounded-xl relative z-10"
      />
    </div>
  );
}
