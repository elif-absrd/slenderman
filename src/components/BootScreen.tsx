import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BOOT_LINES } from '../data/portfolio';

interface BootScreenProps {
  onComplete: () => void;
}

const colorMap = {
  amber: '#E8A020',
  green: '#4ade80',
  white: '#e8e8e0',
  muted: '#555550',
};

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (visibleLines < BOOT_LINES.length) {
      const delay = visibleLines === 0 ? 300 : 140;
      const timer = setTimeout(() => setVisibleLines((v) => v + 1), delay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setDone(true);
        setTimeout(onComplete, 600);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [visibleLines, onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col justify-center bg-black px-8 md:px-16 lg:px-24"
        >
          <div className="max-w-3xl">
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.12 }}
                className="font-mono text-xs md:text-sm leading-relaxed whitespace-pre"
                style={{ color: colorMap[line.type] }}
              >
                {line.text || '\u00A0'}
              </motion.div>
            ))}
            {visibleLines < BOOT_LINES.length && (
              <span
                className="inline-block w-2 h-3.5 align-middle ml-0.5"
                style={{
                  background: '#E8A020',
                  animation: 'blink 0.7s step-end infinite',
                }}
              />
            )}
          </div>
          <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
