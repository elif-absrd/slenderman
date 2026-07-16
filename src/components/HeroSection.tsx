import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  FileText,
  Gamepad2,
  Headphones,
  Laptop,
  Mail,
  Mouse,
} from 'lucide-react';
import { PERSONAL } from '../data/portfolio';

const FLOATING_TOOLS = [
  {
    label: 'Audio',
    Icon: Headphones,
    depth: 18,
    position: 'left-[11%] top-[10%] text-amber',
    motion: 'bob-a rotate-[-5deg]',
  },
  {
    label: 'Systems',
    Icon: Laptop,
    depth: 24,
    position: 'right-[7%] top-[14%] text-text-muted',
    motion: 'bob-b rotate-[5deg]',
  },
  {
    label: 'Game Dev',
    Icon: Gamepad2,
    depth: 14,
    position: 'left-[5%] top-[58%] text-text-primary',
    motion: 'bob-c rotate-[-3deg]',
  },
  {
    label: 'Pointer',
    Icon: Mouse,
    depth: 16,
    position: 'right-[8%] top-[55%] text-amber',
    motion: 'bob-a rotate-[4deg]',
  },
];

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.9.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.74.4-1.26.72-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

export default function HeroSection() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const stage = stageRef.current;
    if (!stage) return;

    const icons = Array.from(stage.querySelectorAll<HTMLElement>('[data-depth]'));

    const handleMouseMove = (event: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (event.clientX - centerX) / rect.width;
      const deltaY = (event.clientY - centerY) / rect.height;

      icons.forEach((icon) => {
        const depth = Number(icon.dataset.depth ?? 15);
        icon.style.setProperty('--hero-float-x', `${deltaX * depth}px`);
        icon.style.setProperty('--hero-float-y', `${deltaY * depth}px`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      icons.forEach((icon) => {
        icon.style.removeProperty('--hero-float-x');
        icon.style.removeProperty('--hero-float-y');
      });
    };
  }, [shouldReduceMotion]);

  return (
    <section
      id="hero"
      className="stacked-panel hero-section relative px-5 sm:px-8 md:px-14 overflow-hidden"
    >
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

      <div className="stacked-panel-inner relative z-10 flex min-h-full flex-col justify-between py-8 md:py-10">
        <div className="relative mx-auto flex w-full max-w-6xl flex-1 items-center justify-center">
          <div
            ref={stageRef}
            className="hero-stage relative h-[530px] w-full max-w-5xl sm:h-[610px] md:h-[650px]"
          >
            <svg
              viewBox="0 0 1200 600"
              className="absolute inset-0 h-full w-full pointer-events-none"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <path
                d="M 960 118 C 1240 285, 1060 485, 610 520 C 250 535, 135 485, 130 312 C 124 145, 335 98, 605 92 C 835 88, 930 178, 965 210"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="hero-draw-path text-amber opacity-75"
              />
            </svg>

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-2 text-center">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="mb-3 font-mono text-[12px] font-medium tracking-[0.08em] text-amber"
              >
                Hey, I'm
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.28 }}
                className="font-mono text-[clamp(2.7rem,7.2vw,5.7rem)] font-bold leading-none text-white"
              >
                Vinay <span className="text-amber">Lunawat</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.68 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-5 text-text-muted"
              >
                <a href={PERSONAL.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-amber" aria-label="GitHub">
                  <GitHubIcon className="h-5 w-5" />
                </a>
                <a href={PERSONAL.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-amber" aria-label="LinkedIn">
                  <LinkedInIcon className="h-5 w-5" />
                </a>
                <a href={`mailto:${PERSONAL.email}`} className="transition-colors hover:text-amber" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
                <a
                  href={PERSONAL.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-amber"
                  aria-label="Resume"
                >
                  <FileText className="h-5 w-5" strokeWidth={1.7} />
                </a>
              </motion.div>
            </div>

            {FLOATING_TOOLS.map(({ label, Icon, depth, position, motion }) => (
              <div
                key={label}
                className={`hero-floating absolute z-20 hidden sm:block ${position}`}
                data-depth={depth}
              >
                <div className={`hero-float-bob ${motion}`}>
                  {label === 'Game Dev' ? (
                    <Link
                      to="/game"
                      className="relative block rounded-[1.45rem] transition-transform duration-300 hover:rotate-0 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                      aria-label="Open games"
                    >
                      <div className="absolute -inset-3 rounded-[1.8rem] bg-current opacity-15 blur-xl" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.35rem] border border-border bg-bg/75 shadow-[0_18px_45px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur sm:h-[4.65rem] sm:w-[4.65rem]">
                        <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.6} />
                      </div>
                    </Link>
                  ) : (
                    <div className="relative rounded-[1.45rem] transition-transform duration-300 hover:rotate-0 hover:scale-110" aria-hidden="true">
                      <div className="absolute -inset-3 rounded-[1.8rem] bg-current opacity-15 blur-xl" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.35rem] border border-border bg-bg/75 shadow-[0_18px_45px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur sm:h-[4.65rem] sm:w-[4.65rem]">
                        <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.6} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.82 }}
          className="flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted"
        >
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-terminal hero-pulse" />
            {PERSONAL.location}
          </span>
          <ChevronDown className="hero-chevron h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
        </motion.div>
      </div>

      <style>{`
        @keyframes heroPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        @keyframes heroDraw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes heroBobA {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(2deg); }
        }
        @keyframes heroBobB {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(-3deg); }
        }
        @keyframes heroBobC {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes heroChevron {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        .hero-draw-path {
          stroke-dasharray: 2600;
          stroke-dashoffset: 2600;
          animation: heroDraw 2.4s cubic-bezier(.43,.13,.23,.96) forwards .2s;
        }
        .hero-floating {
          --hero-float-x: 0px;
          --hero-float-y: 0px;
          transform: translate(var(--hero-float-x), var(--hero-float-y));
          transition: transform 150ms ease-out;
          will-change: transform;
        }
        .hero-float-bob {
          will-change: transform;
        }
        .hero-pulse { animation: heroPulse 2s ease infinite; }
        .hero-chevron { animation: heroChevron 1.8s ease-in-out infinite; }
        .bob-a { animation: heroBobA 5.5s ease-in-out infinite; }
        .bob-b { animation: heroBobB 6.5s ease-in-out infinite; }
        .bob-c { animation: heroBobC 4.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hero-draw-path,
          .hero-pulse,
          .hero-chevron,
          .bob-a,
          .bob-b,
          .bob-c {
            animation: none;
          }
        }
      `}</style>

    </section>
  );
}
