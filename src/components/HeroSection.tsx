import { motion } from 'framer-motion';
import { PERSONAL } from '../data/portfolio';

const BADGES = [
  { label: 'IIT Gandhinagar Scholar', accent: true },
  { label: 'ICPC Regionalist 2024', accent: false },
  { label: 'Robotics Club Chair', accent: false },
  { label: 'HackJKLU Lead', accent: false },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      // min-h with screen so hero fills viewport below the 56px nav
      className="relative px-8 md:px-14 py-20 md:py-28 border-b border-border overflow-hidden"
      style={{ minHeight: 'calc(100vh - 56px)' }}
    >
      {/* Subtle grid bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.04,
          backgroundImage:
            'linear-gradient(#e8e8e0 1px, transparent 1px), linear-gradient(90deg, #e8e8e0 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Amber radial glow bottom-right */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width: '600px',
          height: '400px',
          background:
            'radial-gradient(ellipse at 80% 100%, rgba(232,160,32,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Parallax Rust code snippet — decorative */}
      <div
        className="absolute bottom-10 right-8 md:right-14 font-mono text-[11px] text-[#1e1e1e] select-none pointer-events-none leading-relaxed text-right hidden md:block"
        aria-hidden="true"
      >
        <div>fn boot() -&gt; Result&lt;()&gt; {'{'}</div>
        <div className="pl-4">let uart = UART::init(115200)?;</div>
        <div className="pl-4">let mem = Memory::map_atags()?;</div>
        <div className="pl-4">Kernel::new(uart, mem).run()</div>
        <div>{'}'}</div>
      </div>

      <div className="relative z-10 flex flex-col justify-center h-full">
        {/* Prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-[10px] text-amber tracking-[0.2em] uppercase mb-5"
          style={{ color: '#E8A020' }}
        >
          $ whoami
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-mono font-bold leading-[0.92] tracking-[-0.04em] text-white mb-4"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}
        >
          VINAY
          <br />
          <span style={{ color: '#E8A020' }}>LUNAWAT</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="text-[13px] max-w-lg leading-[1.8] font-sans font-light mb-8"
          style={{ color: '#666660' }}
        >
          Engineering student obsessing over low-level architecture, real-time systems, and
          what happens when software meets bare metal. Rust OS kernels. NOC dashboards.
          Competitive programming at 3am.
        </motion.p>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.44 }}
          className="flex flex-wrap gap-2 mb-9"
        >
          {BADGES.map((b) => (
            <span
              key={b.label}
              className="text-[10px] px-2.5 py-1 border tracking-[0.08em] uppercase"
              style={{
                borderColor: b.accent ? '#7a5210' : '#2a2a2a',
                color: b.accent ? '#E8A020' : '#666660',
              }}
            >
              {b.label}
            </span>
          ))}
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.56 }}
          className="flex flex-wrap gap-6"
        >
          {[
            { label: '→ EMAIL', href: `mailto:${PERSONAL.email}` },
            { label: '→ LINKEDIN', href: PERSONAL.linkedin },
            { label: '→ GITHUB', href: PERSONAL.github },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="text-[11px] tracking-[0.08em] uppercase border-b border-transparent transition-all duration-150"
              style={{ color: '#555550' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#E8A020';
                (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = '#E8A020';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#555550';
                (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'transparent';
              }}
            >
              {link.label}
            </a>
          ))}
        </motion.div>

        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.72 }}
          className="mt-16 pt-6 border-t text-[11px]"
          style={{ borderColor: '#1e1e1e', color: '#444440' }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle"
            style={{ background: '#4ade80', animation: 'heroPulse 2s ease infinite' }}
          />
          System operational · {PERSONAL.email} · {PERSONAL.location}
        </motion.div>
      </div>

      <style>{`
        @keyframes heroPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </section>
  );
}
