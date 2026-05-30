import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { PERSONAL } from '../data/portfolio';
import SectionHeader from './SectionHeader';

const CONTACT_ROWS = [
  { key: 'EMAIL', value: PERSONAL.email, href: `mailto:${PERSONAL.email}`, isLink: true },
  { key: 'LINKEDIN', value: 'linkedin.com/in/vinay-lunawat-944a93287/', href: PERSONAL.linkedin, isLink: true },
  { key: 'GITHUB', value: 'github.com/elif-absrd', href: PERSONAL.github, isLink: true },
  { key: 'LOCATION', value: PERSONAL.location, href: null, isLink: false },
  { key: 'STATUS', value: 'Open to opportunities', href: null, isLink: false, isGreen: true },
];

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="contact" className="px-8 md:px-14 py-16 scroll-mt-14">
      <SectionHeader num="05" title="CONTACT" />

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="font-mono text-[12px] leading-[2.4]">
            {CONTACT_ROWS.map((row) => (
              <div key={row.key} className="flex gap-0">
                <span
                  className="text-text-muted inline-block"
                  style={{ minWidth: '100px' }}
                >
                  {row.key}
                </span>
                {row.isLink ? (
                  <a
                    href={row.href ?? '#'}
                    target={row.href?.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="text-amber border-b border-amber/30 hover:border-amber transition-colors duration-150"
                  >
                    {row.value}
                  </a>
                ) : (
                  <span style={{ color: (row as { isGreen?: boolean }).isGreen ? '#4ade80' : '#e8e8e0' }}>
                    {row.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Terminal block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div
            className="border border-border p-6 font-mono text-[12px] leading-[2]"
            style={{ background: '#111111' }}
          >
            <div>
              <span style={{ color: '#E8A020' }}>$</span>
              <span className="text-text-muted"> curl -X POST /contact \</span>
            </div>
            <div className="text-text-muted pl-5">
              -H <span className="text-white">&quot;Subject: Opportunity&quot;</span> \
            </div>
            <div className="text-text-muted pl-5">
              -d <span className="text-white">&quot;from=you@example.com&quot;</span>
            </div>
            <div className="mt-3">
              <span style={{ color: '#4ade80' }}>200 OK</span>
              <span className="text-text-muted"> — Message delivered.</span>
            </div>
            <div className="text-text-muted mt-0.5">Response time: &lt; 24h</div>
          </div>

          <p className="text-[11px] text-text-muted mt-4 font-sans font-light leading-relaxed">
            Open to internships, research collaborations, and interesting engineering problems.
            If you&apos;re building something that pushes boundaries, reach out.
          </p>
        </motion.div>
      </div>

    </section>
  );
}
