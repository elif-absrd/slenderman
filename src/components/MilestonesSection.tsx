import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { MILESTONES } from '../data/portfolio';
import SectionHeader from './SectionHeader';

export default function MilestonesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="milestones" className="stacked-panel px-8 md:px-14 border-b border-border scroll-mt-14">
      <div className="stacked-panel-inner py-16">
        <SectionHeader num="04" title="MILESTONES" />

        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2"
        >
          {MILESTONES.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 0.8, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="relative border px-7 py-6 -mr-px -mb-px transition-all duration-200"
              style={{
                borderColor: hovered === i ? '#3a3a3a' : '#2a2a2a',
                background: hovered === i ? 'rgba(10,10,10,0.82)' : 'rgba(10,10,10,0.65)',
                zIndex: hovered === i ? 1 : 0,
              }}
            >
              <div className="text-[10px] text-amber tracking-[0.15em] uppercase mb-2">{m.tag}</div>
              <div className="text-[13px] text-white font-medium mb-1.5">{m.title}</div>
              <div className="text-[11px] text-text-muted font-sans font-light leading-relaxed">
                {m.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 
