import { useState, useEffect, useRef } from 'react';

/**
 * Tracks which section is currently "active" based on scroll position.
 * Uses getBoundingClientRect so tall sections (taller than viewport) work
 * correctly — whichever section's top edge is nearest to the nav height wins.
 */
export function useActiveSection(sectionIds: string[]): string {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] ?? '');
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const NAV_HEIGHT = 56;

    function update() {
      let best = sectionIds[0] ?? '';
      let bestDist = Infinity;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Distance of the section's top edge from just below the nav
        const dist = Math.abs(rect.top - NAV_HEIGHT);
        // Only consider sections whose top is above the middle of the viewport
        if (rect.top <= window.innerHeight * 0.6 && dist < bestDist) {
          bestDist = dist;
          best = id;
        }
      }

      setActiveSection(best);
    }

    function onScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update(); // run once on mount

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [sectionIds]);

  return activeSection;
}
