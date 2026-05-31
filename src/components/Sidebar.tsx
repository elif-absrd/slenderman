import { NAV_ITEMS, PERSONAL } from '../data/portfolio';
import { useUptime } from '../hooks/useUptime';

interface SidebarProps {
  activeSection: string;
  visible: boolean;
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function Sidebar({ activeSection, visible }: SidebarProps) {
  const uptime = useUptime(visible);

  return (
    <aside
      className="hidden lg:flex flex-col sticky top-0 h-screen border-r border-border"
      style={{ width: '240px', minWidth: '240px' }}
    >
      {/* Header */}
      <div className="px-6 py-6 border-b border-border">
        <div className="text-[10px] text-text-muted tracking-widest uppercase mb-1">
          PID 2808 · ACTIVE
        </div>
        <div className="text-sm font-bold text-amber tracking-wide leading-tight">
          {PERSONAL.name}
        </div>
        <div className="text-[11px] text-text-muted mt-1 leading-relaxed">
          Systems Programmer
          <br />
          CSE · JKLU &apos;27
        </div>
      </div>

      {/* Nav */}
      <div className="flex flex-col pt-4">
        <div className="px-6 mb-2 text-[10px] text-text-muted tracking-widest uppercase">
          PROCESS TABLE
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex items-center gap-3 px-6 py-2 text-xs transition-all duration-150 border-l-2 text-left w-full bg-transparent ${
                isActive
                  ? 'text-amber border-amber'
                  : 'text-text-muted border-transparent hover:text-amber hover:border-amber hover:bg-amber/5'
              }`}
              style={{ cursor: 'pointer' }}
            >
              <span
                className={`text-[10px] min-w-[1.5rem] ${isActive ? 'text-amber/60' : 'text-border'}`}
              >
                {item.num}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-auto px-6 py-5 border-t border-border">
        <div className="text-[10px] text-text-muted">
          <span className="text-green-terminal">●</span> UPTIME:{' '}
          <span className="text-text-primary">{uptime}</span>
        </div>
        <div className="text-[10px] text-text-muted mt-1">MEM: 64K · ARCH: x86_64</div>
      </div>
    </aside>
  );
}
