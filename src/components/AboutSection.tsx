import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { EDUCATION, PERSONAL } from '../data/portfolio';
import SectionHeader from './SectionHeader';

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="px-8 md:px-14 py-16 border-b border-border scroll-mt-14">
      <SectionHeader num="01" title="ABOUT" />

      <div
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16"
      >
        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {PERSONAL.bio.split('\n\n').map((para, i) => (
            <p
              key={i}
              className="text-[13px] text-text-primary font-sans font-light leading-[1.9] mb-5 last:mb-0"
            >
              {para}
            </p>
          ))}
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col">
            {EDUCATION.map((edu, i) => (
              <div key={i} className="flex gap-4 relative">
                {/* Vertical line */}
                {i < EDUCATION.length - 1 && (
                  <div
                    className="absolute left-[5px] top-5 bottom-0 w-px bg-border"
                    style={{ zIndex: 0 }}
                  />
                )}
                {/* Dot */}
                <div
                  className="flex-shrink-0 mt-1 w-3 h-3 border relative z-10"
                  style={{
                    borderColor: edu.highlight ? '#E8A020' : '#2a2a2a',
                    background: edu.highlight ? '#E8A020' : '#0a0a0a',
                  }}
                />
                {/* Content */}
                <div className="pb-7 last:pb-0">
                  <div className="text-[10px] text-text-muted tracking-widest mb-1">
                    {edu.year}
                  </div>
                  <div className="text-[13px] font-medium text-white mb-0.5">
                    {edu.institution}
                  </div>
                  <div className="text-[11px] text-text-muted font-sans leading-relaxed">
                    {edu.degree}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
