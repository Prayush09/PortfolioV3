import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Ensure ScrollTrigger is registered
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrambleTextProps {
  text: string;
  className?: string;
  trigger?: 'scroll' | 'load' | 'hover';
  scrambleSpeed?: number;
}

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

const ScrambleText: React.FC<ScrambleTextProps> = ({ 
  text, 
  className = '', 
  trigger = 'scroll',
  scrambleSpeed = 30 
}) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const isAnimatingRef = useRef(false);

  const scramble = () => {
    if (isAnimatingRef.current || !elementRef.current) return;
    isAnimatingRef.current = true;

    const length = text.length;
    let iteration = 0;
    
    const interval = setInterval(() => {
      if (!elementRef.current) {
        clearInterval(interval);
        return;
      }

      elementRef.current.innerText = text
        .split('')
        .map((letter, index) => {
          if (index < iteration) {
            return text[index];
          }
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      if (iteration >= length) {
        clearInterval(interval);
        isAnimatingRef.current = false;
      }

      iteration += 1 / 3;
    }, scrambleSpeed);
  };

  useEffect(() => {
    if (!elementRef.current) return;

    // Trigger Logic
    if (trigger === 'load') {
      // Small delay to ensure layout is ready
      setTimeout(scramble, 500);
    } else if (trigger === 'scroll') {
      ScrollTrigger.create({
        trigger: elementRef.current,
        start: "top 85%",
        onEnter: () => scramble(),
        once: true // Only animate once on entry
      });
    } else if (trigger === 'hover') {
        const el = elementRef.current;
        el.addEventListener('mouseenter', scramble);
        return () => el.removeEventListener('mouseenter', scramble);
    }

    // Cleanup ScrollTrigger instances for this component
    return () => {
      // In a complex app we'd track the specific instance, but here we rely on GSAP's garbage collection
    };
  }, [text, trigger]);

  return (
    <span ref={elementRef} className={`inline-block ${className}`}>
      {text}
    </span>
  );
};

export default ScrambleText;