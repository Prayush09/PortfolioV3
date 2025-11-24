import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowUpRight } from 'lucide-react';
import ScrambleText from './ScrambleText';
import { SparklesCore } from './Sparkles';

// --- Background Boxes Component ---
interface BackgroundBoxesProps {
    activeCell: { r: number; c: number } | null;
}

const BackgroundBoxes: React.FC<BackgroundBoxesProps> = ({ activeCell }) => {
  const rows = 8;
  const cols = 12;
  
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none flex flex-col overflow-hidden opacity-20">
       {Array.from({ length: rows }).map((_, r) => (
         <div key={`row-${r}`} className="flex w-full h-full border-t border-slate-700/30">
            {Array.from({ length: cols }).map((_, c) => (
                <div 
                    key={`box-${r}-${c}`}
                    className="relative w-full h-full border-r border-slate-700/30 transition-colors duration-300"
                >
                    {/* Highlight Element */}
                    <motion.div
                         initial={{ opacity: 0 }}
                         animate={{ 
                             opacity: activeCell?.r === r && activeCell?.c === c ? 1 : 0,
                             transition: { duration: 0.5 }
                         }}
                         className="absolute inset-0 bg-blue-500/20 backdrop-blur-[1px]"
                    />
                     <div className="absolute -top-[3px] -left-[3px]">
                         <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-600/50">
                             <path d="M3 0V6M0 3H6" stroke="currentColor" strokeWidth="1"/>
                         </svg>
                     </div>
                </div>
            ))}
         </div>
       ))}
    </div>
  );
};

const Contact: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCell, setActiveCell] = useState<{r: number, c: number} | null>(null);
  
  const rows = 8;
  const cols = 12;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const colWidth = rect.width / cols;
    const rowHeight = rect.height / rows;
    const c = Math.floor(x / colWidth);
    const r = Math.floor(y / rowHeight);
    if (c >= 0 && c < cols && r >= 0 && r < rows) setActiveCell({ r, c });
    else setActiveCell(null);
  };

  const handleMouseLeave = () => setActiveCell(null);

  return (
    <section id="contact" className="py-32 px-6 relative z-10 min-h-[80vh] flex flex-col justify-center items-center">
      <div className="max-w-5xl w-full mx-auto text-center relative group">
        
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
          whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative bg-[#0a0a0a]/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-24 overflow-hidden shadow-2xl perspective-1000 group-hover:border-white/20 transition-colors duration-500"
        >
          {/* Interactive Grid Background */}
          <BackgroundBoxes activeCell={activeCell} />
          
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-30"></div>

          <div className="relative z-10 flex flex-col items-center justify-center">
            
            {/* 1. Title */}
            <h2 className="text-5xl md:text-8xl font-display font-bold text-white tracking-tighter mb-0 relative z-20">
                Ready to start
            </h2>
            
            {/* 2. Horizon & Sparkles Effect Container */}
            <div className="w-full h-40 relative">
                {/* Horizon Glows */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 blur-[1px]"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
                <div className="absolute top-0 left-1/4 w-1/2 h-5 bg-gradient-to-r from-transparent via-sky-500 to-transparent blur-xl opacity-50"></div>
                
                {/* Sparkles with Radial Mask */}
                <div 
                    className="absolute inset-0 w-full h-full" 
                    style={{ 
                        maskImage: 'radial-gradient(350px 200px at top, white, transparent)',
                        WebkitMaskImage: 'radial-gradient(350px 200px at top, white, transparent)'
                    }}
                >
                    <SparklesCore
                        background="transparent"
                        minSize={0.4}
                        maxSize={1}
                        particleDensity={1200}
                        className="w-full h-full"
                        particleColor="#FFFFFF"
                    />
                </div>
            </div>

            {/* 3. Subtext */}
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light mt-4 relative z-20">
              Open for opportunities. Let's create something <span className="text-blue-400">impactful</span> together.
            </p>
            
            {/* 4. Button */}
            <a 
                href="mailto:contact@prayushgiri.com" 
                className="relative inline-flex h-14 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 group/btn z-20"
            >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-base font-medium text-white backdrop-blur-3xl transition-colors hover:bg-slate-900 gap-2 relative z-20">
                    <Mail size={18} className="group-hover/btn:scale-110 transition-transform" />
                    <ScrambleText text="Contact Me" trigger="hover" scrambleSpeed={15} />
                </span>
            </a>
          </div>
        </motion.div>

        <div className="mt-16 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm px-4">
          <p>© 2025 Prayush Giri.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
             <a href="https://github.com/Prayush09" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1 group">
                Github <ArrowUpRight size={12} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"/>
             </a>
             <a href="#" className="hover:text-white transition-colors flex items-center gap-1 group">
                LinkedIn <ArrowUpRight size={12} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"/>
             </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;