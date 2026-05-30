import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BootScreen from './components/BootScreen';
import TopNav from './components/TopNav';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import MilestonesSection from './components/MilestonesSection';
import ContactSection from './components/ContactSection';
import { Footer } from './components/ui/footer-section';
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

  // Init Lenis smooth scroll after boot
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
            {/* Top nav — fixed, transparent over hero, gains bg on scroll */}
            <TopNav activeSection={activeSection} visible={booted} />

            {/* Main content — pt-14 so nothing hides behind the 56px nav */}
            <main className="flex-1 pt-14">
              <HeroSection />
              <AboutSection />
              <SkillsSection />
              <ProjectsSection />
              <MilestonesSection />
              <ContactSection />
            </main>

            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
