import { useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// APPROACH: canvas is position:fixed, full viewport size.
// Constellations are defined in PAGE-pixel coords (absolute from top of doc).
// Every frame we offset their Y by -window.scrollY so they appear to live
// at a fixed spot in the scrollable page — exactly like a parallax background.
// Scatter stars also tile across the full page and are offset by scrollY.
// Mouse parallax is a small additional nudge on top.
// ─────────────────────────────────────────────────────────────────────────────


// Raw constellation data — x is fraction of viewport width, y is fraction of zone height
// Zone placement: 0=hero screen, 1=skills screen, 2=projects screen
const RAW_CONSTELLATIONS = [
  {
    name: 'URSA MAJOR',
    zoneStart: 0, zoneOffset: 0.08, zoneHeight: 0.30,
    side: 'right' as const,
    rawStars: [
      [0.58, 0.70],
      [0.63, 1.00],
      [0.73, 0.95],
      [0.70, 0.45],
      [0.77, 0.22],
      [0.84, 0.08],
      [0.90, 0.00],
    ] as [number,number][],
    lines: [[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]] as [number,number][],
    heroStar: 6,
  },
  {
    name: 'ORION',
    zoneStart: 1, zoneOffset: 0.05, zoneHeight: 0.75,
    side: 'left' as const,
    rawStars: [
      [0.12, 0.00],
      [0.04, 0.20],
      [0.20, 0.17],
      [0.07, 0.50],
      [0.12, 0.54],
      [0.17, 0.58],
      [0.05, 0.82],
      [0.22, 1.00],
    ] as [number,number][],
    lines: [
      [0,1],[0,2],
      [1,3],[2,5],
      [3,4],[4,5],
      [1,6],[2,7],
      [3,6],[5,7],
    ] as [number,number][],
    heroStar: 7,
  },
  {
    name: 'URSA MINOR',
    zoneStart: 2, zoneOffset: 0.10, zoneHeight: 0.55,
    side: 'right' as const,
    rawStars: [
      [0.92, 0.00],
      [0.82, 0.20],
      [0.74, 0.38],
      [0.62, 0.72],
      [0.68, 1.00],
      [0.78, 0.88],
    ] as [number,number][],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,2]] as [number,number][],
    heroStar: 0,
  },
];

interface ConStar {
  vx: number;      // fraction of viewport width (0..1)
  pageY: number;   // absolute Y in page pixels
  r: number;
  baseAlpha: number;
  phase: number;
  speed: number;
}

interface BuiltConstellation {
  name: string;
  stars: ConStar[];
  lines: [number, number][];
  heroStar: number;
}

function buildConstellations(VH: number): BuiltConstellation[] {
  return RAW_CONSTELLATIONS.map((def) => ({
    name: def.name,
    lines: def.lines,
    heroStar: def.heroStar,
    stars: def.rawStars.map(([vx, localY], si): ConStar => {
      const isHero = si === def.heroStar;
      const topPx  = (def.zoneStart + def.zoneOffset) * VH;
      const pageY  = topPx + localY * def.zoneHeight * VH;
      return {
        vx,
        pageY,
        r:         isHero ? 1.55 : 0.75 + Math.random() * 0.55,
        baseAlpha: isHero ? 0.80 : 0.40 + Math.random() * 0.28,
        phase:     Math.random() * Math.PI * 2,
        speed:     0.005 + Math.random() * 0.007,
      };
    }),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// SCATTER — stored as [vx fraction, pageY px]
// ─────────────────────────────────────────────────────────────────────────────

interface ScatterStar {
  vx: number;
  pageY: number;
  r: number;
  baseAlpha: number;
  phase: number;
  speed: number;
  layer: 0 | 1 | 2;
}

const PARALLAX_MOUSE = [3, 8, 14] as const;

function buildScatter(count: number, VH: number, pageH: number): ScatterStar[] {
  const out: ScatterStar[] = [];
  for (let i = 0; i < count; i++) {
    const roll  = i % 10;
    const layer = (roll < 6 ? 0 : roll < 9 ? 1 : 2) as 0|1|2;
    out.push({
      vx:    Math.random(),
      pageY: Math.random() * pageH,
      r:
        layer === 0 ? 0.25 + Math.random() * 0.28 :
        layer === 1 ? 0.35 + Math.random() * 0.32 :
                      0.50 + Math.random() * 0.38,
      baseAlpha:
        layer === 0 ? 0.030 + Math.random() * 0.040 :
        layer === 1 ? 0.055 + Math.random() * 0.050 :
                      0.075 + Math.random() * 0.055,
      phase:  Math.random() * Math.PI * 2,
      speed:  0.003 + Math.random() * 0.009,
      layer,
    });
  }
  // suppress unused param warnings
  void VH;
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────

const LINE_ALPHA  = 0.058;
const LABEL_ALPHA = 0.068;

export default function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const c   = ctx;
    const cvs = canvas;

    let VW = 0, VH = 0, pageH = 0;
    let mx = 0, my = 0;
    let smx = 0, smy = 0;
    let rafId = 0;
    let tick  = 0;

    let scatter: ScatterStar[]           = [];
    let constellations: BuiltConstellation[] = [];

    function rebuild() {
      scatter       = buildScatter(120, VH, pageH);
      constellations = buildConstellations(VH);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      VW    = window.innerWidth;
      VH    = window.innerHeight;
      pageH = document.documentElement.scrollHeight;
      // Canvas covers viewport only (fixed position)
      cvs.width  = VW * dpr;
      cvs.height = VH * dpr;
      cvs.style.width  = `${VW}px`;
      cvs.style.height = `${VH}px`;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      mx = VW / 2; my = VH / 2;
      smx = mx;    smy = my;
      rebuild();
    }

    function onMouseMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
    }

    function dot(x: number, y: number, r: number, alpha: number) {
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fillStyle = `rgba(232,160,32,${alpha.toFixed(3)})`;
      c.fill();
    }

    function spike(x: number, y: number, len: number, alpha: number, lw: number) {
      c.save();
      c.strokeStyle = `rgba(232,160,32,${alpha.toFixed(3)})`;
      c.lineWidth = lw;
      c.beginPath(); c.moveTo(x - len, y); c.lineTo(x + len, y); c.stroke();
      c.beginPath(); c.moveTo(x, y - len); c.lineTo(x, y + len); c.stroke();
      c.restore();
    }

    function draw() {
      tick += 0.008;
      c.clearRect(0, 0, VW, VH);

      smx += (mx - smx) * 0.04;
      smy += (my - smy) * 0.04;

      const scrollY = window.scrollY;
      // Mouse offset from viewport centre (−0.5 … 0.5)
      const normX = smx / VW - 0.5;
      const normY = smy / VH - 0.5;

      // ── Scatter ─────────────────────────────────────────────────────────
      for (const s of scatter) {
        const mx_off = normX * PARALLAX_MOUSE[s.layer];
        const my_off = normY * PARALLAX_MOUSE[s.layer];
        // Convert pageY → screen Y by subtracting scrollY, then wrap into viewport
        const rawScreenY = s.pageY - scrollY + my_off;
        // Skip stars not near viewport (with a small buffer)
        if (rawScreenY < -10 || rawScreenY > VH + 10) continue;
        const sx = ((s.vx * VW + mx_off) % VW + VW) % VW;
        const sy = rawScreenY;
        const a  = s.baseAlpha * (0.7 + 0.3 * Math.sin(tick * s.speed * 80 + s.phase));
        dot(sx, sy, s.r, a);
      }

      // ── Constellations ───────────────────────────────────────────────────
      for (const con of constellations) {
        // Build screen positions for this frame
        const pos = con.stars.map((s) => {
          const mx_off = normX * PARALLAX_MOUSE[1];
          const my_off = normY * PARALLAX_MOUSE[1];
          return {
            x: s.vx * VW + mx_off,
            y: s.pageY - scrollY + my_off,
            r: s.r,
            a: s.baseAlpha * (0.8 + 0.2 * Math.sin(tick * s.speed * 80 + s.phase)),
          };
        });

        // Skip entire constellation if none of its stars are near viewport
        const anyVisible = pos.some(p => p.y > -60 && p.y < VH + 60);
        if (!anyVisible) continue;

        // Lines
        c.save();
        c.strokeStyle = `rgba(232,160,32,${LINE_ALPHA})`;
        c.lineWidth = 0.6;
        for (const [a, b] of con.lines) {
          if (!pos[a] || !pos[b]) continue;
          c.beginPath();
          c.moveTo(pos[a].x, pos[a].y);
          c.lineTo(pos[b].x, pos[b].y);
          c.stroke();
        }
        c.restore();

        // Label
        if (pos[0]) {
          c.save();
          c.font = '7px "IBM Plex Mono", monospace';
          c.fillStyle = `rgba(232,160,32,${LABEL_ALPHA})`;
          c.fillText(con.name, pos[0].x + 6, pos[0].y - 7);
          c.restore();
        }

        // Stars + spikes
        for (let si = 0; si < pos.length; si++) {
          const p      = pos[si];
          const isHero = si === con.heroStar;
          dot(p.x, p.y, p.r, p.a);
          if (isHero) {
            spike(p.x, p.y, p.r * 4.5, p.a * 0.55, 0.65);
          } else if (p.r > 1.1) {
            spike(p.x, p.y, p.r * 2.8, p.a * 0.25, 0.4);
          }
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize',    resize,       { passive: true });

    const ro = new ResizeObserver(() => {
      const newPageH = document.documentElement.scrollHeight;
      if (newPageH !== pageH) {
        pageH = newPageH;
        rebuild();
      }
    });
    ro.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize',    resize);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        zIndex:        0,
        pointerEvents: 'none',
      }}
    />
  );
}