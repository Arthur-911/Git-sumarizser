import { LanguageStat } from "@/types/github";

export interface WavePoint {
  x: number;
  y: number;
  targetY: number;
  vy: number;
}

export interface Bubble {
  x: number;
  yRatio: number;
  radius: number;
  speed: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  phase: number;
}

export function initPoints(width: number, numPoints: number, restingY: number): WavePoint[] {
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
  return pts;
}

export function initBubbles(count: number = 16): Bubble[] {
  const bubbles: Bubble[] = [];
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
  return bubbles;
}

export function updateSprings(
  pts: WavePoint[],
  numPoints: number,
  restingY: number,
  clock: number,
  tension = 0.014,
  dampening = 0.055,
  spread = 0.12
) {
  if (pts.length !== numPoints) return;

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

export function applyMouseImpulse(
  pts: WavePoint[],
  numPoints: number,
  normalizedX: number,
  dx: number,
  speed: number
) {
  if (!pts || pts.length !== numPoints) return;

  const targetIndex = Math.floor(normalizedX * (numPoints - 1));
  const impulse = 0.35 + speed * 0.18;
  const direction = dx >= 0 ? 1 : -1;
  const splashRadius = 8;

  for (let i = -splashRadius; i <= splashRadius; i++) {
    const idx = targetIndex + i;
    if (idx >= 0 && idx < numPoints) {
      const dist = Math.abs(i) / splashRadius;
      const factor = Math.cos(dist * (Math.PI / 2));

      if (i === 0) {
        pts[idx].vy += impulse * 0.35;
      } else if ((direction > 0 && i > 0) || (direction < 0 && i < 0)) {
        pts[idx].vy -= impulse * factor * 0.3;
      } else {
        pts[idx].vy += impulse * factor * 0.12;
      }
    }
  }
}

export function findLanguageAtPercent(
  languages: LanguageStat[],
  percent: number
): LanguageStat | null {
  let accum = 0;
  for (const lang of languages) {
    accum += lang.percentage;
    if (percent <= accum || lang === languages[languages.length - 1]) {
      return lang;
    }
  }
  return null;
}
