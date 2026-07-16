import { useState, useEffect, useRef } from 'react';

/**
 * Tracks which section is currently "active" based on scroll position.
 * Uses viewport hit-testing because GSAP-pinned panels can overlap in document
 * space; the active nav item should match the section the user can see.
 */
export function useActiveSection(sectionIds: string[]): string {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] ?? '');
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const NAV_HEIGHT = 56;

    function update() {
      const samplePoints = [
        [window.innerWidth / 2, NAV_HEIGHT + window.innerHeight * 0.25],
        [window.innerWidth / 2, NAV_HEIGHT + window.innerHeight * 0.45],
        [window.innerWidth / 2, NAV_HEIGHT + window.innerHeight * 0.65],
      ];

      for (const [x, y] of samplePoints) {
        const elements = document.elementsFromPoint(x, y);
        const section = elements
          .map((el) => el.closest<HTMLElement>('section[id]'))
          .find((el): el is HTMLElement => Boolean(el && sectionIds.includes(el.id)));

        if (section) {
          setActiveSection(section.id);
          return;
        }
      }

      if (window.scrollY < window.innerHeight * 0.4) {
        setActiveSection(sectionIds[0] ?? '');
      }
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
