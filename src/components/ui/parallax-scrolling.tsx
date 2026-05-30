'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export function initLenis() {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenisInstance.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function destroyLenis() {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

// ── Parallax hero visual used inside HeroSection ──
export function ParallaxHero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = ref.current?.querySelector('[data-parallax-layers]');
    if (!trigger) return;

    const layers = [
      { layer: '1', yPercent: 40 },
      { layer: '2', yPercent: 28 },
      { layer: '3', yPercent: 16 },
      { layer: '4', yPercent: 6 },
    ];

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: '0% 0%',
        end: '100% 0%',
        scrub: 0.6,
      },
    });

    layers.forEach((l, idx) => {
      tl.to(
        trigger.querySelectorAll(`[data-parallax-layer="${l.layer}"]`),
        { yPercent: l.yPercent, ease: 'none' },
        idx === 0 ? undefined : '<'
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <div data-parallax-layers className="relative w-full h-full">
        {/* Layer 1 — far background grid texture */}
        <div
          data-parallax-layer="1"
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(232,160,32,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,160,32,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Layer 2 — mid accent lines */}
        <div
          data-parallax-layer="2"
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="w-[600px] h-px opacity-20"
            style={{ background: 'linear-gradient(90deg, transparent, #E8A020, transparent)' }}
          />
        </div>
        {/* Layer 3 — foreground code snippet */}
        <div
          data-parallax-layer="3"
          className="absolute bottom-0 right-0 pb-8 pr-6 font-mono text-[11px] text-[#2a2a2a] select-none pointer-events-none leading-relaxed text-right"
        >
          <div>fn main() {'{'}</div>
          <div className="pl-4">let kernel = Kernel::new();</div>
          <div className="pl-4">kernel.boot().unwrap();</div>
          <div>{'}'}</div>
        </div>
        {/* Layer 4 — near-field noise overlay */}
        <div
          data-parallax-layer="4"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(232,160,32,0.03) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
}
