import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Building2, Briefcase, ChevronUp, ChevronDown } from 'lucide-react';
import { Experience as ExperienceType } from '../types';
import TextReveal from './TextReveal';

const experiences: ExperienceType[] = [
  {
    id: 1,
    role: "Consultant",
    company: "EY Global Delivery Services",
    period: "07/2025 - Present",
    description: [
      "Technology Consultant: Provided daily support to clients.",
      "Utilizing JS, TS, and Node.js for scalable solutions.",
      "Collaborating in an agile environment."
    ]
  },
  {
    id: 2,
    role: "Projects / Proof of Work",
    company: "Freelance / Personal",
    period: "08/2024 - 05/2025",
    description: [
      "Developed full-stack apps integrating AI.",
      "Deployed complex architectures on GCP.",
      "Focused on Audio DSP and ML integration."
    ]
  }
];

const Experience: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const rotateWheel = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : experiences.length - 1));
    } else {
      setActiveIndex((prev) => (prev < experiences.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <section id="experience" className="min-h-screen py-32 px-6 relative z-10 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="mb-20 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl">
             <Briefcase className="text-blue-400" size={32} />
          </div>
          <div>
            <TextReveal text="Experience" className="text-4xl md:text-5xl font-display font-bold text-white" />
            <div className="mt-2 text-gray-400">
                <TextReveal text="Professional timeline & Milestones." />
            </div>
          </div>
        </div>

        {/* Mobile View (Vertical Timeline) - Visible on small screens */}
        <div className="lg:hidden space-y-8">
            {experiences.map((exp, index) => (
                <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative overflow-hidden"
                >
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                     
                     <div className="flex flex-col gap-4 relative z-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono mb-3 border border-blue-500/20">
                                <Calendar size={12} />
                                {exp.period}
                            </div>
                            <h3 className="text-2xl font-display font-bold text-white mb-1">
                                {exp.role}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Building2 size={16} />
                                {exp.company}
                            </div>
                        </div>
                        
                        <div className="space-y-3 border-l border-blue-500/20 pl-4">
                             {exp.description.map((item, i) => (
                                <p key={i} className="text-gray-300 text-sm leading-relaxed">
                                    {item}
                                </p>
                             ))}
                        </div>
                     </div>
                </motion.div>
            ))}
        </div>

        {/* Desktop View (3D Wheel) - Hidden on mobile */}
        <div className="hidden lg:grid grid-cols-2 gap-12 items-center h-[500px]">
            
            {/* Left: The Wheel (Visual Selector) */}
            <div className="relative h-full flex items-center justify-end pr-20">
                {/* Navigation Controls */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
                    <button 
                        onClick={() => rotateWheel('up')}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronUp size={20} />
                    </button>
                    <div className="w-px h-12 bg-gradient-to-b from-transparent via-blue-500 to-transparent mx-auto"></div>
                    <button 
                        onClick={() => rotateWheel('down')}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronDown size={20} />
                    </button>
                </div>

                {/* The Rotating List */}
                <div className="relative w-full max-w-sm h-[300px] perspective-1000">
                    {experiences.map((exp, index) => {
                        let offset = index - activeIndex;
                        if (offset > experiences.length / 2) offset -= experiences.length;
                        if (offset < -experiences.length / 2) offset += experiences.length;

                        const isActive = offset === 0;
                        const opacity = Math.max(0, 1 - Math.abs(offset) * 0.5);
                        const scale = Math.max(0.8, 1 - Math.abs(offset) * 0.1);
                        const rotateX = offset * -30; 
                        const z = offset * -100;
                        const y = offset * 120;

                        return (
                            <motion.div
                                key={exp.id}
                                initial={false}
                                animate={{
                                    y,
                                    z,
                                    rotateX,
                                    scale,
                                    opacity,
                                    filter: isActive ? 'blur(0px)' : 'blur(4px)'
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                onClick={() => setActiveIndex(index)}
                                className={`
                                    absolute top-1/2 left-0 w-full -translate-y-1/2 cursor-pointer
                                    p-6 rounded-xl border transition-colors duration-300
                                    ${isActive 
                                        ? 'bg-blue-950/20 border-blue-500/50 shadow-lg shadow-blue-900/20 z-10' 
                                        : 'bg-black/40 border-white/5 z-0 hover:bg-white/5'
                                    }
                                `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className={`text-xl font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>
                                        {exp.role}
                                    </h3>
                                    {isActive && (
                                        <motion.div layoutId="active-indicator" className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
                                    )}
                                </div>
                                <div className={`text-sm font-mono mb-2 ${isActive ? 'text-blue-400' : 'text-gray-600'}`}>
                                    {exp.period}
                                </div>
                                <div className={`text-sm ${isActive ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {exp.company}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Right: Active Detail Panel */}
            <div className="relative h-full flex items-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl w-full relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-500"></div>
                        
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono mb-6 border border-blue-500/20">
                                <Calendar size={12} />
                                {experiences[activeIndex].period}
                            </div>

                            <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                                {experiences[activeIndex].role}
                            </h3>
                            
                            <div className="flex items-center gap-2 text-xl text-gray-400 mb-8">
                                <Building2 size={20} />
                                {experiences[activeIndex].company}
                            </div>

                            <div className="space-y-4">
                                {experiences[activeIndex].description.map((item, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 + 0.2 }}
                                        className="flex items-start gap-4 group/item"
                                    >
                                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500/30 group-hover/item:bg-blue-400 transition-colors"></div>
                                        <p className="text-gray-300 leading-relaxed">{item}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

        </div>
      </div>
    </section>
  );
};

export default Experience;