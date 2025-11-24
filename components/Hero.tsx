import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import ScrambleText from './ScrambleText';

// NOTE: The 3D Background (Stars, BlackHole) is now handled globally in components/Background.tsx
// to ensure seamless transitions between sections.

const Hero: React.FC = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax for the text content
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <section ref={containerRef} id="home" className="min-h-screen flex items-center relative overflow-hidden bg-transparent">
      
      {/* Content Layer */}
      <div className="max-w-7xl mx-auto w-full px-6 z-10 relative pointer-events-none grid grid-cols-1 md:grid-cols-2">
        <motion.div 
            style={{ y, opacity }}
            initial="hidden" 
            animate="show" 
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="flex flex-col justify-center"
        >
          <motion.div variants={variants} className="flex items-center gap-3 mb-6 pointer-events-auto">
            <div className="h-[1px] w-12 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
            {/* Use ScrambleText on load for the subtitle */}
            <ScrambleText 
                text="SOFTWARE ENGINEER" 
                trigger="load" 
                className="text-blue-400 tracking-[0.3em] text-xs font-bold uppercase text-glow-blue" 
            />
          </motion.div>

          <div className="mb-8 pointer-events-auto">
             <h1 className="text-7xl md:text-8xl lg:text-9xl font-display font-bold leading-[0.9] tracking-tight text-white">
                <ScrambleText text="Prayush" trigger="load" />
                <br />
                <ScrambleText text="Giri." trigger="load" className="text-gray-500" />
             </h1>
          </div>

          <motion.p variants={variants} className="text-xl text-gray-400 max-w-md leading-relaxed font-light mb-12 pointer-events-auto">
            Engineering robust systems with <span className="text-blue-400 font-medium text-glow-blue">Go</span> & <span className="text-blue-400 font-medium text-glow-blue">TypeScript</span>. 
            Merging backend logic with creative interactivity.
          </motion.p>

          <motion.div variants={variants} className="flex flex-wrap gap-4 pointer-events-auto">
            <HeroButton href="https://github.com/Prayush09" icon={Github} label="GitHub" />
            <HeroButton href="#" icon={Linkedin} label="LinkedIn" />
            <HeroButton href="mailto:prayushgiri@gmail.com" icon={Mail} label="Email" primary />
          </motion.div>
        </motion.div>
        
        {/* Right side is left empty to reveal the global Black Hole background */}
        <div className="hidden md:block"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-6 flex items-center gap-4 text-gray-600 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="h-[1px] w-12 bg-gray-800"></div>
      </motion.div>
    </section>
  );
};

const HeroButton: React.FC<{ href: string; icon: React.ComponentType<any>; label: string; primary?: boolean }> = ({ href, icon: Icon, label, primary }) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`flex items-center gap-3 px-8 py-4 rounded-full border transition-all duration-300 group relative overflow-hidden pointer-events-auto ${
        primary 
          ? 'bg-blue-600/10 border-blue-500/50 hover:bg-blue-600 hover:border-blue-600 text-white' 
          : 'bg-transparent border-white/10 hover:border-white/30 text-gray-400 hover:text-white'
      }`}
    >
      <Icon size={18} className="relative z-10" />
      <span className="font-medium text-sm tracking-wide relative z-10">{label}</span>
      
      {primary && (
         <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
      )}
    </a>
  );
}

export default Hero;