import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from './contexts/LanguageContext';
import PageTransition from './components/PageTransition';

// Lazy load pages for performance
const AppleLandingPage = lazy(() => import('./components/AppleLandingPage'));
const ProjectDetail = lazy(() => import('./components/ProjectDetail'));
const About = lazy(() => import('./components/About'));
const Archive = lazy(() => import('./components/Archive'));
const HandParticleInteraction = lazy(() => import('./components/HandParticleInteraction'));
const OrbitLanding = lazy(() => import('./pages/Orbit/OrbitLanding'));
const OrbitFeed = lazy(() => import('./pages/Orbit/OrbitFeed'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><AppleLandingPage /></PageTransition>} />
        <Route path="/project/:id" element={<PageTransition><ProjectDetail /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/archive" element={<PageTransition><Archive /></PageTransition>} />
        <Route path="/interaction" element={<PageTransition><HandParticleInteraction /></PageTransition>} />
        <Route path="/orbit" element={<PageTransition><OrbitLanding /></PageTransition>} />
        <Route path="/orbit/feed" element={<PageTransition><OrbitFeed /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <AnimatedRoutes />
          </Suspense>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
