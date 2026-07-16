import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useStackedSectionScroll(
  wrapperRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useLayoutEffect(() => {
    if (!enabled || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.stacked-panel');
      panels.pop();

      const setupPanel = (panel: HTMLElement) => {
        const innerPanel = panel.querySelector<HTMLElement>('.stacked-panel-inner');
        if (!innerPanel) return;

        const panelHeight = innerPanel.offsetHeight;
        const viewportHeight = panel.offsetHeight || window.innerHeight;
        const scrollOverflow = Math.max(panelHeight - viewportHeight, 0);
        const fakeScrollRatio = scrollOverflow
          ? scrollOverflow / (scrollOverflow + viewportHeight)
          : 0;

        if (fakeScrollRatio) {
          gsap.set(panel, { marginBottom: panelHeight * fakeScrollRatio });
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'bottom bottom',
            end: () => (fakeScrollRatio ? `+=${innerPanel.offsetHeight}` : 'bottom top'),
            pin: true,
            pinSpacing: false,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        if (fakeScrollRatio) {
          timeline.to(innerPanel, {
            yPercent: -100,
            y: viewportHeight,
            duration: 1 / (1 - fakeScrollRatio) - 1,
            ease: 'none',
          });
        }

        timeline
          .fromTo(panel, { scale: 1, opacity: 1 }, { scale: 0.7, opacity: 0.5, duration: 0.9 })
          .to(panel, { opacity: 0, duration: 0.1 });
      };

      panels.forEach(setupPanel);
      ScrollTrigger.refresh();
    }, wrapper);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize', refresh);

    return () => {
      window.removeEventListener('resize', refresh);
      ctx.revert();
    };
  }, [enabled, wrapperRef]);
}
