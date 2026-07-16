import { useState, useCallback, useRef } from 'react';
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
import { useStackedSectionScroll } from './hooks/useStackedSectionScroll';
import { NAV_ITEMS } from './data/portfolio';

const SECTION_IDS = NAV_ITEMS.map((n) => n.id);

export default function App() {
  const [booted, setBooted] = useState(false);
  const slidesRef = useRef<HTMLElement | null>(null);
  const activeSection = useActiveSection(SECTION_IDS);
  useStackedSectionScroll(slidesRef, booted);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

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
              <main ref={slidesRef} className="slides-wrapper flex-1 pt-14">
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
