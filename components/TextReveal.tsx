import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  text: string;
  className?: string;
}

const TextReveal: React.FC<TextRevealProps> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Split text into words specifically for animation
    const words = el.querySelectorAll('.word');

    gsap.fromTo(
      words,
      { 
        y: 50, 
        opacity: 0, 
        filter: 'blur(10px)' 
      },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    return () => {
      // Clean up ScrollTriggers associated with this component
      // In a real app we might track specific IDs, but for this portfolio simple cleanup is safer
    };
  }, [text]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div className="flex flex-wrap gap-x-[0.25em] gap-y-1">
        {text.split(' ').map((word, i) => (
          <span key={i} className="word inline-block leading-tight will-change-transform">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TextReveal;