import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { PROJECTS } from '../data/portfolio';
import SectionHeader from './SectionHeader';

export default function ProjectsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="projects" className="stacked-panel px-8 md:px-14 scroll-mt-14">
      <div className="stacked-panel-inner py-16">
        <SectionHeader num="03" title="PROJECTS" />

        <div ref={ref} className="flex flex-col">
          {PROJECTS.map((proj, i) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setHovered(proj.id)}
              onMouseLeave={() => setHovered(null)}
              className="relative border px-7 py-7 -mt-px cursor-default transition-all duration-200"
              style={{
                borderColor: hovered === proj.id ? '#3a3a3a' : '#2a2a2a',
                background: hovered === proj.id ? 'rgba(10,10,10,0.82)' : 'rgba(10,10,10,0.65)',
                zIndex: hovered === proj.id ? 1 : 0,
              }}
            >
              {/* Ghost number */}
              <div
                className="absolute right-6 bottom-4 font-bold leading-none pointer-events-none select-none"
                style={{
                  fontSize: '72px',
                  color: 'rgba(255,255,255,0.025)',
                  fontFamily: '"IBM Plex Mono", monospace',
                }}
              >
                {proj.id}
              </div>

              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <div className="text-[14px] font-bold text-white tracking-tight">{proj.name}</div>
                  <div className="text-[11px] text-text-muted font-sans mt-0.5">{proj.period}</div>
                </div>
                <div className="text-[10px] text-amber tracking-[0.08em] uppercase sm:text-right whitespace-nowrap">
                  {proj.stack.join(' · ')}
                </div>
              </div>

              {/* Description */}
              <p className="text-[12px] text-text-muted font-sans font-light leading-[1.75] relative z-10">
                {proj.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
