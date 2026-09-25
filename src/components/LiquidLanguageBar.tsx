"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { LanguageStat } from "@/types/github";

interface LiquidLanguageBarProps {
  languages: LanguageStat[];
  selectedLanguage?: string | null;
  onSelectLanguage?: (lang: string | null) => void;
  onHoverLanguage?: (lang: LanguageStat | null, posPercent: number | null) => void;
}

interface WavePoint {
  x: number;
  y: number;
  targetY: number;
  vy: number;
}

interface Bubble {
  x: number;
  yRatio: number;
  radius: number;
  speed: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  phase: number;
}

export function LiquidLanguageBar({
  languages,
  selectedLanguage,
  onSelectLanguage,
  onHoverLanguage,
}: LiquidLanguageBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Physics simulation references
  const animFrameId = useRef<number | null>(null);
  const pointsRef = useRef<WavePoint[]>([]);
  const bubblesRef = useRef<Bubble[]>([]);
  const lastMousePos = useRef<{ x: number; y: number; time: number } | null>(null);
  const isHoveredRef = useRef(false);

  const numPoints = 100;
  const restingY = 7; // Distance from top for resting surface level

  // Initialize bubbles
  useEffect(() => {
    const bubbles: Bubble[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      bubbles.push({
        x: Math.random(),
        yRatio: 0.35 + Math.random() * 0.55,
        radius: 1 + Math.random() * 2,
        speed: 0.0008 + Math.random() * 0.0016,
        wobbleSpeed: 1.5 + Math.random() * 2.5,
        wobbleAmp: 0.004 + Math.random() * 0.006,
        phase: Math.random() * Math.PI * 2,
      });
    }
    bubblesRef.current = bubbles;
  }, []);

  // Initialize wave points
  const initPoints = useCallback((width: number) => {
    const pts: WavePoint[] = [];
    for (let i = 0; i < numPoints; i++) {
      const x = (i / (numPoints - 1)) * width;
      pts.push({
        x,
        y: restingY,
        targetY: restingY,
        vy: 0,
      });
    }
    pointsRef.current = pts;
  }, [restingY]);

  // Main simulation and render loop
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
      initPoints(width);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // Physics parameters - calm, silky ripple physics
    const tension = 0.014;
    const dampening = 0.055;
    const spread = 0.12;

    let clock = 0;

    const render = () => {
      clock += 0.014;
      const pts = pointsRef.current;

      if (pts.length === numPoints) {
        // 1. Spring physics update with gentle organic breathing
        for (let i = 0; i < pts.length; i++) {
          const pt = pts[i];
          pt.targetY = restingY + Math.sin(clock * 0.9 + (i / numPoints) * Math.PI * 2) * 0.18;
          const force = -tension * (pt.y - pt.targetY) - dampening * pt.vy;
          pt.vy += force;

          // Clamp velocity to prevent runaway agitation
          pt.vy = Math.max(-0.7, Math.min(0.7, pt.vy));
          pt.y += pt.vy;

          // Hard-clamp wave to a calm, gentle window of +/- 2.5px around resting surface
          if (pt.y < restingY - 2.5) {
            pt.y = restingY - 2.5;
            pt.vy = 0;
          } else if (pt.y > restingY + 2.5) {
            pt.y = restingY + 2.5;
            pt.vy = 0;
          }
        }

        // 2. Neighbor wave propagation passes (smooth fluid glide)
        for (let pass = 0; pass < 2; pass++) {
          for (let i = 0; i < pts.length; i++) {
            if (i > 0) {
              const leftDelta = spread * (pts[i].y - pts[i - 1].y);
              pts[i - 1].vy += leftDelta;
              pts[i - 1].y += leftDelta;
            }
            if (i < pts.length - 1) {
              const rightDelta = spread * (pts[i].y - pts[i + 1].y);
              pts[i + 1].vy += rightDelta;
              pts[i + 1].y += rightDelta;
            }
          }
        }
      }

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Total percentage accumulator for boundaries
      let cumulativePercent = 0;
      const boundaries: { lang: LanguageStat; xStart: number; xEnd: number }[] = [];

      languages.forEach((lang) => {
        const startX = (cumulativePercent / 100) * width;
        cumulativePercent += lang.percentage;
        const endX = (cumulativePercent / 100) * width;
        boundaries.push({ lang, xStart: startX, xEnd: endX });
      });

      // 3. Draw each liquid segment
      boundaries.forEach(({ lang, xStart, xEnd }) => {
        const isSelected = selectedLanguage === lang.name;
        const isDimmed = selectedLanguage && !isSelected;

        // Find wave points in this segment's range
        const startIndex = Math.max(0, Math.floor((xStart / width) * (numPoints - 1)));
        const endIndex = Math.min(numPoints - 1, Math.ceil((xEnd / width) * (numPoints - 1)));

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xStart, height);

        // First point at wave height
        const startY = pts[startIndex] ? pts[startIndex].y : restingY;
        ctx.lineTo(xStart, startY);

        // Smooth curve along wave points
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

        // Fluid color gradient
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

        // Selected neon aura
        if (isSelected) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.8;
          ctx.shadowColor = lang.color;
          ctx.shadowBlur = 14;
          ctx.stroke();
        }

        ctx.restore();

        // Internal meniscus boundary line between liquids
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

      // 4. Draw continuous glowing surface meniscus wave line
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

      // 5. Render floating micro-bubbles
      const bubbles = bubblesRef.current;
      bubbles.forEach((b) => {
        // Calm, gentle bobbing
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

      // 6. Draw internal typography for wide segments
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

      // Continue animation loop
      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [languages, selectedLanguage, initPoints, restingY]);

  // Handle cursor hover and movement along the bar to induce waves
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

    // Determine which language is under cursor
    let accum = 0;
    let hovered: LanguageStat | null = null;
    for (const lang of languages) {
      accum += lang.percentage;
      if (percent <= accum || lang === languages[languages.length - 1]) {
        hovered = lang;
        break;
      }
    }

    if (onHoverLanguage) {
      onHoverLanguage(hovered, percent);
    }

    // Liquid wave physics impulse based on cursor movement
    if (lastMousePos.current) {
      const dt = Math.max(10, currentTime - lastMousePos.current.time);
      const dx = x - lastMousePos.current.x;
      const speed = Math.min(Math.abs(dx) / dt, 2.0);

      // Map cursor X to wave point index
      const targetIndex = Math.floor(normalizedX * (numPoints - 1));
      const pts = pointsRef.current;

      if (pts && pts.length === numPoints) {
        // Calibrated gentle ripple impulse (0.35 to 0.70 max)
        const impulse = 0.35 + speed * 0.18;
        const direction = dx >= 0 ? 1 : -1;
        const splashRadius = 8;

        for (let i = -splashRadius; i <= splashRadius; i++) {
          const idx = targetIndex + i;
          if (idx >= 0 && idx < numPoints) {
            const dist = Math.abs(i) / splashRadius;
            const factor = Math.cos(dist * (Math.PI / 2));

            // Soft fluid displacement (gentle dip & crest)
            if (i === 0) {
              pts[idx].vy += impulse * 0.35;
            } else if ((direction > 0 && i > 0) || (direction < 0 && i < 0)) {
              pts[idx].vy -= impulse * factor * 0.30;
            } else {
              pts[idx].vy += impulse * factor * 0.12;
            }
          }
        }
      }
    }

    lastMousePos.current = { x, y, time: currentTime };
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
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

    let accum = 0;
    for (const lang of languages) {
      accum += lang.percentage;
      if (percent <= accum || lang === languages[languages.length - 1]) {
        if (selectedLanguage === lang.name) {
          onSelectLanguage(null);
        } else {
          onSelectLanguage(lang.name);
        }
        break;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="group relative h-9 w-full rounded-2xl bg-zinc-950/90 border border-zinc-700/80 p-1 shadow-[inset_0_3px_10px_rgba(0,0,0,0.9),0_2px_12px_rgba(0,0,0,0.5)] cursor-pointer select-none overflow-hidden transition-all duration-300 hover:border-zinc-500/80 hover:shadow-[0_0_24px_rgba(6,182,212,0.2),inset_0_3px_10px_rgba(0,0,0,0.9)]"
    >
      {/* Curved Glass Specular Highlight (Top Half of Tube) */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-2xl z-20" />

      {/* Bottom Caustic Reflection */}
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white/10 to-transparent pointer-events-none rounded-b-2xl z-20" />

      {/* Glass Tube Endcaps Vignette */}
      <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/40 to-transparent pointer-events-none z-20" />
      <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/40 to-transparent pointer-events-none z-20" />

      {/* The Dynamic Liquid Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block rounded-xl relative z-10"
      />
    </div>
  );
}
