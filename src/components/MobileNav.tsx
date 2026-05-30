import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '../data/portfolio';

interface MobileNavProps {
  activeSection: string;
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function MobileNav({ activeSection }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const active = NAV_ITEMS.find((n) => n.id === activeSection);

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-40 border-b border-border bg-bg/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-5 py-3">
        <div>
          <div className="text-xs font-bold text-amber tracking-wide">VINAY LUNAWAT</div>
          <div className="text-[10px] text-text-muted">
            [{active?.num}] {active?.label}
          </div>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex flex-col gap-1 p-2 text-text-muted hover:text-amber transition-colors"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-current transition-all ${open ? 'rotate-45 translate-y-[5px]' : ''}`} />
          <span className={`block w-5 h-px bg-current transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-current transition-all ${open ? '-rotate-45 -translate-y-[5px]' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-5 py-3 text-xs border-l-2 transition-all ${
                  activeSection === item.id
                    ? 'text-amber border-amber bg-amber/5'
                    : 'text-text-muted border-transparent'
                }`}
              >
                <span className="text-[10px] text-border min-w-[1.5rem]">{item.num}</span>
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
