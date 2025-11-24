import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '@react-three/drei';

interface LoaderProps {
  onLoadingComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onLoadingComplete }) => {
  // R3F asset loading progress
  // active is true if currently loading, false otherwise
  const { progress, active } = useProgress();
  
  // Visual timer state
  const [count, setCount] = useState(0);
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Visual Timer (always runs to 100 for effect)
  useEffect(() => {
    const duration = 2000; // Minimum 2 seconds visual load
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const interval = setInterval(() => {
      setCount((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  // 2. Track actual asset loading
  useEffect(() => {
    // If progress reaches 100 OR active becomes false (loading finished or nothing to load)
    if (progress === 100 || !active) {
        setIsAssetsLoaded(true);
    }
  }, [progress, active]);

  // 3. Safety Fallback: Force complete after 5 seconds max to prevent stuck loader
  useEffect(() => {
    fallbackTimerRef.current = setTimeout(() => {
      console.warn("Loader fallback triggered");
      setIsAssetsLoaded(true);
      setCount(100);
    }, 5000);

    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    }
  }, []);

  // 4. Dismiss only when BOTH visual timer is done AND assets are loaded
  useEffect(() => {
    if (count === 100 && isAssetsLoaded) {
      const timer = setTimeout(() => {
        onLoadingComplete();
      }, 800); // Fade out delay
      return () => clearTimeout(timer);
    }
  }, [count, isAssetsLoaded, onLoadingComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.2 } }}
    >
      <div className="relative flex flex-col items-center justify-center">
        <motion.div
            animate={count === 100 && isAssetsLoaded ? { 
                x: [0, -2, 2, -2, 2, 0], 
                scale: 0.95,
            } : {}}
            transition={{ duration: 0.4 }}
            className="relative z-20 text-center"
        >
            <h1 className="text-8xl md:text-9xl font-bold font-display text-white tracking-tighter tabular-nums">
                {Math.floor(count)}%
            </h1>
        </motion.div>
        
        {count === 100 && isAssetsLoaded && (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 30 }}
                transition={{ 
                    duration: 0.8, 
                    ease: [0.76, 0, 0.24, 1],
                    delay: 0.4 
                }}
                className="absolute w-32 h-32 bg-white rounded-full z-10 mix-blend-exclusion"
            />
        )}

        <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: count > 20 ? 1 : 0, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 text-blue-500 font-mono text-sm uppercase tracking-widest"
        >
            {progress < 100 && active ? "Compiling Shaders..." : "System Ready"}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Loader;