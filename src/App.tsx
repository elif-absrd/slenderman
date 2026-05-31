import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BootScreen from './components/BootScreen';
import TopNav from './components/TopNav';
import HeroSection from './components/HeroSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import MilestonesSection from './components/MilestonesSection';
import { Footer } from './components/ui/footer-section';
import ConstellationBackground from './components/ConstellationBackground';
import { useActiveSection } from './hooks/useActiveSection';
import { NAV_ITEMS } from './data/portfolio';
import { initLenis, destroyLenis } from './components/ui/parallax-scrolling';

const SECTION_IDS = NAV_ITEMS.map((n) => n.id);

export default function App() {
  const [booted, setBooted] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  useEffect(() => {
    if (!booted) return;
    initLenis();
    return () => destroyLenis();
  }, [booted]);

  return (
    <>
      <BootScreen onComplete={handleBootComplete} />

      <AnimatePresence>
        {booted && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col min-h-screen"
          >
            {/* Fixed constellation canvas — z-0, behind everything */}
            <ConstellationBackground />

            {/* All content sits at z-10+ so canvas stays purely decorative */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <TopNav activeSection={activeSection} visible={booted} />
              <main className="flex-1 pt-14">
                <HeroSection />
                <SkillsSection />
                <ProjectsSection />
                <MilestonesSection />
              </main>
              <Footer />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
