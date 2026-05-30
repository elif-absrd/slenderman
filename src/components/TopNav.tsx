import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalIcon } from 'lucide-react';
import { NAV_ITEMS, PERSONAL } from '../data/portfolio';
import { useUptime } from '../hooks/useUptime';

interface TopNavProps {
  activeSection: string;
  visible: boolean;
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function TopNav({ activeSection, visible }: TopNavProps) {
  const uptime = useUptime(visible);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── TOP NAV BAR ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-[#2a2a2a] bg-[#0a0a0a]/90 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="flex items-center justify-between px-6 md:px-10 h-14">
          {/* Left — Logo / Identity */}
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2.5 group"
          >
            <TerminalIcon
              className="w-4 h-4 transition-colors duration-150 group-hover:text-amber"
              style={{ color: scrolled ? '#E8A020' : '#666660' }}
            />
            <span className="font-mono text-[11px] font-bold text-white tracking-wide leading-none">
              {PERSONAL.petname}
            </span>
            <span
              className="hidden sm:block font-mono text-[10px] text-[#444440] tracking-widest pl-2 border-l border-[#2a2a2a]"
              style={{ marginLeft: '4px' }}
            >
              PID:2808
            </span>
          </button>

          {/* Centre — Nav links (desktop) */}
          <div className="hidden md:flex items-center gap-0">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-1.5 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors duration-150 ${
                    isActive ? 'text-[#E8A020]' : 'text-[#555550] hover:text-[#e8e8e0]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-px"
                      style={{ background: '#E8A020' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right — Status + hamburger */}
          <div className="flex items-center gap-4">
            {/* Uptime (hidden on small) */}
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-[#444440]">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"
                style={{ animation: 'navPulse 2s ease infinite' }}
              />
              {uptime}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex md:hidden flex-col gap-[5px] p-1.5 text-[#666660] hover:text-[#E8A020] transition-colors"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-5 h-px bg-current transition-all duration-200 origin-center ${
                  menuOpen ? 'rotate-45 translate-y-[6px]' : ''
                }`}
              />
              <span
                className={`block w-5 h-px bg-current transition-all duration-200 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block w-5 h-px bg-current transition-all duration-200 origin-center ${
                  menuOpen ? '-rotate-45 -translate-y-[6px]' : ''
                }`}
              />
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-[#2a2a2a] bg-[#0a0a0a]/97 backdrop-blur-md md:hidden"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      scrollToSection(item.id);
                      setMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-6 py-3.5 font-mono text-xs border-b border-[#1a1a1a] border-l-2 transition-all duration-150 ${
                      isActive
                        ? 'text-[#E8A020] border-l-[#E8A020] bg-[#E8A020]/5'
                        : 'text-[#555550] border-l-transparent'
                    }`}
                  >
                    <span className="text-[10px] text-[#2a2a2a] min-w-[1.5rem]">{item.num}</span>
                    {item.label}
                  </button>
                );
              })}
              <div className="flex items-center gap-1.5 px-6 py-4 font-mono text-[10px] text-[#333330]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                UPTIME: {uptime} · {PERSONAL.location}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <style>{`
        @keyframes navPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </>
  );
}
