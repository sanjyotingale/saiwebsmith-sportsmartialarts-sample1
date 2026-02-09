import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Gallery } from './pages/Gallery';
import { Announcements } from './pages/Announcements';
import { Instructors } from './pages/Instructors';
import { Branches } from './pages/Branches';
import { Admission } from './pages/Admission';
import { Rules } from './pages/Rules';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const ScrollTrigger = (window as any).ScrollTrigger;
    if (ScrollTrigger) {
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }
  }, [pathname]);
  return null;
};

const PageTransitionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    const gsap = (window as any).gsap;
    if (!gsap) return;
    gsap.fromTo(".page-content", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 1, ease: "expo.out" }
    );
  }, [location.pathname]);

  return <div className="page-content">{children}</div>;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <PageTransitionWrapper>
          <Routes>
            {/* Landing page explicitly at root / */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/instructors" element={<Instructors />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/rules" element={<Rules />} />
            {/* Redirect any other path to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransitionWrapper>
      </Layout>
    </Router>
  );
};

export default App;