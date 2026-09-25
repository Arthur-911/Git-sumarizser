"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  trailColor: string;
  headColor: string;
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Drifting star/snow particles
    const particleColors = ["#ffffff", "#38bdf8", "#22d3ee", "#a5f3fc", "#818cf8"];
    const particleCount = Math.min(Math.floor((width * height) / 16000), 50);
    const particles: Particle[] = Array.from({ length: particleCount }, () => {
      const baseOpacity = 0.25 + Math.random() * 0.55;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.8 + Math.random() * 1.6,
        speedY: 0.35 + Math.random() * 0.65, // Gentle downward drift like cosmic snow
        speedX: (Math.random() - 0.5) * 0.25,
        opacity: baseOpacity,
        baseOpacity,
        twinkleSpeed: 0.015 + Math.random() * 0.03,
        twinklePhase: Math.random() * Math.PI * 2,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
      };
    });

    // Shooting stars
    const shootingStars: ShootingStar[] = [];
    let nextShootingStarTime = Date.now() + 800 + Math.random() * 1500;

    const spawnShootingStar = () => {
      // Spawn diagonally from upper area
      const startX = Math.random() * (width * 0.9);
      const startY = Math.random() * (height * 0.4);
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.25; // ~45 deg

      shootingStars.push({
        x: startX,
        y: startY,
        length: 130 + Math.random() * 120,
        speed: 13 + Math.random() * 7,
        angle,
        opacity: 1,
        trailColor: Math.random() > 0.35 ? "rgba(34, 211, 238, " : "rgba(129, 140, 248, ",
        headColor: "#ffffff",
      });

      nextShootingStarTime = Date.now() + 2200 + Math.random() * 3000;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw drifting star & snow particles
      for (const p of particles) {
        p.twinklePhase += p.twinkleSpeed;
        p.opacity = p.baseOpacity + Math.sin(p.twinklePhase) * 0.3;
        p.y += p.speedY;
        p.x += p.speedX;

        // Wrap around screen boundaries
        if (p.y > height) {
          p.y = -5;
          p.x = Math.random() * width;
        }
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.15, Math.min(1, p.opacity));
        ctx.shadowBlur = p.radius > 1.3 ? 8 : 4;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      // 2. Trigger shooting star
      if (Date.now() > nextShootingStarTime) {
        spawnShootingStar();
      }

      // 3. Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;

        const tailX = star.x - Math.cos(star.angle) * star.length;
        const tailY = star.y - Math.sin(star.angle) * star.length;

        star.opacity -= 0.014;

        if (star.opacity <= 0 || star.y > height + 200 || star.x > width + 200) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.save();
        const grad = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
        grad.addColorStop(0, "rgba(255, 255, 255, 0)");
        grad.addColorStop(0.65, `${star.trailColor}${star.opacity * 0.7})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${star.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(star.x, star.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#38bdf8";
        ctx.stroke();

        // Glowing Star Head
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = star.headColor;
        ctx.globalAlpha = star.opacity;
        ctx.shadowBlur = 14;
        ctx.shadowColor = "#ffffff";
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
