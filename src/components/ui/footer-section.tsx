'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ExternalLinkIcon, Link2Icon, MailIcon, TerminalIcon } from 'lucide-react';
import { PERSONAL } from '../../data/portfolio';

interface FooterLink {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  external?: boolean;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    label: 'Navigate',
    links: [
      { title: 'Skills', href: '#skills' },
      { title: 'Projects', href: '#projects' },
      { title: 'Milestones', href: '#milestones' },
    ],
  },
  {
    label: 'System',
    links: [
      { title: 'VINAY_OS v1.0.0', href: '#hero' },
      { title: 'Build: 2025', href: '#hero' },
      { title: 'Arch: x86_64', href: '#hero' },
      { title: 'PID: 1337', href: '#hero' },
    ],
  },
  {
    label: 'Connect',
    links: [
      { title: 'GitHub', href: PERSONAL.github, icon: ExternalLinkIcon, external: true },
      { title: 'LinkedIn', href: PERSONAL.linkedin, icon: Link2Icon, external: true },
      { title: 'Email', href: `mailto:${PERSONAL.email}`, icon: MailIcon, external: false },
    ],
  },
];



export function Footer() {
  return (
    <footer className="relative w-full border-t border-[#2a2a2a] px-8 md:px-14 py-14" style={{ background: 'rgba(10,10,10,0.80)' }}>
      {/* Amber glow line at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px h-px w-1/3 rounded-full"
        style={{ background: 'linear-gradient(90deg, transparent, #E8A020, transparent)' }}
      />

      <div className="grid w-full gap-10 xl:grid-cols-3 xl:gap-8 max-w-none">
        {/* Brand col */}
        <AnimatedContainer className="space-y-4">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-5 h-5 text-amber" style={{ color: '#E8A020' }} />
            <span className="font-mono text-sm font-bold text-white tracking-wide">VINAY LUNAWAT</span>
          </div>
          <p className="font-mono text-[11px] text-[#666660] leading-relaxed max-w-[240px]">
            Systems programmer. Kernel builder.
            <br />
            CSE @ JKLU · IIT Gandhinagar Scholar.
          </p>
          <p className="font-mono text-[10px] text-[#444440]">
            © {new Date().getFullYear()} Vinay Lunawat.
            <br />
            Built from scratch. No templates.
          </p>
        </AnimatedContainer>

        {/* Links grid */}
        <div className="mt-6 grid grid-cols-3 gap-8 xl:col-span-2 xl:mt-0">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div>
                <h3 className="font-mono text-[10px] text-[#666660] tracking-widest uppercase mb-4">
                  {section.label}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noreferrer' : undefined}
                        className="font-mono text-[12px] text-[#555550] hover:text-[#E8A020] inline-flex items-center gap-1.5 transition-colors duration-150 border-b border-transparent hover:border-[#7a5210]"
                      >
                        {link.icon && <link.icon className="w-3 h-3 flex-shrink-0" />}
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <AnimatedContainer delay={0.5}>
        <div className="mt-12 pt-6 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="font-mono text-[10px] text-[#333330] tracking-widest">
            KERNEL: STABLE · MEM: 64K · UPTIME: ∞
          </div>
          <div className="font-mono text-[10px] text-[#333330]">
            {PERSONAL.location} · {PERSONAL.email}
          </div>
        </div>
      </AnimatedContainer>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>['className'];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
