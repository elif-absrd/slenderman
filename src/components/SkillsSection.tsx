import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { SKILLS } from '../data/portfolio';
import SectionHeader from './SectionHeader';

export default function SkillsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" className="px-8 md:px-14 py-16 scroll-mt-14">
      <SectionHeader num="02" title="SKILLS" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-x-auto"
      >
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th
                className="text-left text-[10px] text-text-muted tracking-widest uppercase px-4 py-3 border border-border font-normal"
                style={{ background: 'rgba(255,255,255,0.02)', width: '160px' }}
              >
                Category
              </th>
              <th
                className="text-left text-[10px] text-text-muted tracking-widest uppercase px-4 py-3 border border-border font-normal"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                Stack
              </th>
            </tr>
          </thead>
          <tbody>
            {SKILLS.map((row, i) => (
              <motion.tr
                key={row.category}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.35, delay: 0.05 * i }}
              >
                <td
                  className="px-4 py-3 border border-border text-[10px] tracking-widest uppercase align-top"
                  style={{ color: '#E8A020', width: '160px' }}
                >
                  {row.category}
                </td>
                <td className="px-4 py-3 border border-border">
                  <div className="flex flex-wrap gap-1">
                    {row.items.map((skill) => (
                      <span
                        key={skill.name}
                        className="inline-block text-[11px] px-2 py-0.5 border transition-colors duration-150"
                        style={{
                          borderColor: skill.hot ? '#3a3a3a' : '#2a2a2a',
                          color: skill.hot ? '#e8e8e0' : '#666660',
                        }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </section>
  );
}
