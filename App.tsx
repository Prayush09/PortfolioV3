
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import AIChat from './components/AIChat';
import Loader from './components/Loader';
import Cursor from './components/Cursor';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <Cursor />
      
      <AnimatePresence mode="wait">
        {isLoading && (
          <Loader onLoadingComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div 
            className="relative min-h-screen font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            {/* Dynamic Interactive Background */}
            <Background />

            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <main className="relative z-10 flex flex-col gap-0">
                <Hero />
                <About />
                <Projects />
                <Experience />
                <Contact />
            </main>

            {/* Gemini AI Assistant */}
            <AIChat />
        </motion.div>
      )}
    </>
  );
};

export default App;
