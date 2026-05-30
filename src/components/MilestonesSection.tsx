import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MILESTONES } from '../data/portfolio';
import SectionHeader from './SectionHeader';

export default function MilestonesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="milestones" className="px-8 md:px-14 py-16 border-b border-border scroll-mt-14">
      <SectionHeader num="04" title="MILESTONES" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 border border-border"
        style={{ gap: '1px', background: '#2a2a2a' }}
      >
        {MILESTONES.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="px-7 py-6 transition-colors duration-150 group"
            style={{ background: '#0a0a0a' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = '#111111';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = '#0a0a0a';
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
    </section>
  );
}
