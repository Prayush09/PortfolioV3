
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Layers, X } from 'lucide-react';
import { Project } from '../types';
import ScrambleText from './ScrambleText';
import TextReveal from './TextReveal';

const PROJECTS: Project[] = [
  {
    title: "Audio Fingerprinting",
    timeline: "2025 — Ongoing",
    description: "High-performance acoustic fingerprinting system written in Go. Implements Shazam-like algorithms.",
    summary: [
      "FFT & Bluestein Algorithm.",
      "Constellation mapping.",
      "44.1kHz signal processing.",
    ],
    tech: ["Go", "DSP", "FFT", "Postgres"],
    links: [
      { label: "Source", href: "https://github.com/Prayush09/MusicRecognition"}
    ],
  },
  {
    title: "ResuNest",
    timeline: "Apr 2025 – May 2025",
    description: "AI-powered resume builder with real-time suggestions and Gemini integration.",
    summary: [
      "Gemini AI generation.",
      "Custom rich-text editor.",
      "GCP VM + Nginx deployment.",
    ],
    tech: ["Next.js", "Gemini AI", "GCP", "Prisma"],
    links: [
      { label: "GitHub", href: "https://github.com/Prayush09/Resunet" },
      { label: "Live", href: "https://resunest.prayushgiri.com" },
    ],
  },
  {
    title: "Homeey",
    timeline: "Aug 2024 – Nov 2024",
    description: "ML-driven roommate matching platform with preference-based algorithms.",
    summary: [
      "Python ML scoring.",
      "RESTful API architecture.",
      "Real-time chat system.",
    ],
    tech: ["Node.js", "Python", "React", "Postgres"],
    links: [{ label: "GitHub", href: "https://github.com/Prayush09/Final-Year-Project" }],
  },
  {
    title: "ZiDraw",
    timeline: "March 2025",
    description: "Real-time collaborative whiteboard using WebSockets and HTML5 Canvas.",
    summary: [
      "Low-latency WebSockets.",
      "Synchronized rendering.",
      "CI/CD pipeline to GCP.",
    ],
    tech: ["WebSockets", "Canvas", "GCP", "Docker"],
    links: [{ label: "GitHub", href: "https://github.com/Prayush09/ZiDraw" }],
  },
];

interface HolographicCardProps {
    project: Project;
    uniqueId: string; // Unique ID for layoutId
    onClick: () => void;
}

const HolographicCard: React.FC<HolographicCardProps> = ({ project, uniqueId, onClick }) => {
  
  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 150, damping: 15 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 200;
    const yPct = (mouseY / height - 0.5) * 200;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative flex-shrink-0 w-[350px] md:w-[450px] h-[500px] p-4">
        <motion.div
            layoutId={`card-${uniqueId}`}
            onClick={onClick}
            style={{ 
                rotateX, 
                rotateY,
                transformStyle: "preserve-3d" 
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full h-full bg-[#0a0a0a]/40 backdrop-blur-md border border-white/20 rounded-sm overflow-hidden shadow-2xl group hover:border-blue-500/50 transition-colors duration-500 flex flex-col cursor-pointer"
        >
            {/* Holographic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {/* Sharp Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-white/30 group-hover:border-blue-500 transition-colors"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-white/30 group-hover:border-blue-500 transition-colors"></div>

            {/* Content */}
            <div className="relative z-10 p-8 flex flex-col h-full transform transition-transform duration-300 group-hover:translate-z-10" style={{ transform: "translateZ(20px)" }}>
                
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="text-blue-400 text-xs font-mono tracking-wider uppercase mb-2">{project.timeline}</div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                            <ScrambleText text={project.title} trigger="hover" />
                        </h3>
                    </div>
                    <div className="p-2 bg-white/5 rounded-sm text-white border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all shadow-lg hidden md:block">
                        <Layers size={20} />
                    </div>
                </div>

                {/* Body */}
                <div className="flex-grow space-y-6">
                    <p className="text-gray-300 leading-relaxed text-sm line-clamp-4">
                        {project.description}
                    </p>
                    
                    <div className="space-y-3 border-l border-blue-500/20 pl-4">
                        {project.summary?.slice(0, 2).map((line, i) => ( 
                            <div key={i} className="flex items-center gap-3 text-xs text-gray-400">
                                <span>{line}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-6 border-t border-white/10">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.slice(0, 3).map((t, i) => ( 
                            <span key={i} className="px-2 py-1 text-[10px] uppercase tracking-wider bg-white/5 text-gray-400 rounded-sm border border-white/10 font-medium">
                                {t}
                            </span>
                        ))}
                        {project.tech.length > 3 && (
                            <span className="px-2 py-1 text-[10px] uppercase tracking-wider bg-white/5 text-gray-400 rounded-sm border border-white/10 font-medium">
                                +{project.tech.length - 3}
                            </span>
                        )}
                    </div>
                    
                    <div className="text-blue-400 text-sm font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                        View Details <ArrowUpRight size={14} />
                    </div>
                </div>
            </div>
        </motion.div>
    </div>
  );
};

interface ExpandedProjectCardProps {
    project: Project;
    uniqueId: string;
    onClose: () => void;
}

const ExpandedProjectCard: React.FC<ExpandedProjectCardProps> = ({ project, uniqueId, onClose }) => {
    // Lock body scroll when modal is open
    useEffect(() => {
        // Small timeout to ensure transition starts smoothly
        const timer = setTimeout(() => {
            document.body.style.overflow = 'hidden';
        }, 10);
        return () => {
            clearTimeout(timer);
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
            {/* Backdrop Blur */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-lg"
                onClick={onClose}
            />

            <motion.div
                layoutId={`card-${uniqueId}`}
                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/20 rounded-sm shadow-2xl relative z-10 flex flex-col md:flex-row"
            >
                <button 
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-50"
                >
                    <X size={20} />
                </button>

                {/* Left: Details */}
                <div className="p-8 md:p-12 w-full">
                    <div className="mb-8">
                        <div className="text-blue-400 text-sm font-mono tracking-wider uppercase mb-3">{project.timeline}</div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{project.title}</h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            {project.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div>
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Layers size={18} className="text-blue-500"/> Key Features</h4>
                            <ul className="space-y-3">
                                {project.summary?.map((line, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                                        <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Tech Stack</h4>
                            <div className="flex flex-wrap gap-2">
                                {project.tech.map((t, i) => (
                                    <span key={i} className="px-3 py-1.5 text-xs uppercase tracking-wider bg-blue-500/10 text-blue-300 rounded-sm border border-blue-500/20 font-medium">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-6 pt-8 border-t border-white/10">
                        {project.links.map((link, i) => (
                            <a 
                                key={i} 
                                href={link.href}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-base font-bold text-white bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-sm transition-colors"
                            >
                                {link.label} 
                                <ArrowUpRight size={18} />
                            </a>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

interface ActiveProjectState {
    project: Project;
    uniqueId: string;
}

const Projects: React.FC = () => {
  const [activeProject, setActiveProject] = useState<ActiveProjectState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Prepare duplicated projects with unique IDs for seamless looping
  const displayProjects = useMemo(() => {
      const sets = 4; // Number of duplicates
      let items: { project: Project, uniqueId: string }[] = [];
      for (let i = 0; i < sets; i++) {
          items = items.concat(PROJECTS.map((p, index) => ({
              project: p,
              uniqueId: `proj-${index}-set-${i}`
          })));
      }
      return items;
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const speed = 1; // Pixels per frame

    const scroll = () => {
        // Only scroll if no project is active (modal closed)
        if (!activeProject) {
            if (container.scrollLeft >= container.scrollWidth / 2) {
                container.scrollLeft = 0; // Seamless reset
            } else {
                container.scrollLeft += speed;
            }
        }
        animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [activeProject]);

  return (
    <section id="projects" className="py-32 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
             <TextReveal text="Selected Works" className="text-4xl md:text-6xl font-display font-bold mb-4 text-white" />
             <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
          </div>
          <div className="text-gray-400 max-w-sm text-sm text-right hidden md:block">
             <TextReveal text="Click to expand. Auto-scrolling gallery." />
          </div>
        </div>
      </div>

      {/* Auto-Scrolling Container */}
      <div 
        ref={containerRef}
        className="flex gap-4 overflow-x-hidden px-6 pb-12 select-none"
        style={{ 
            maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' 
        }}
      >
        {displayProjects.map((item) => (
            <HolographicCard 
                key={item.uniqueId}
                project={item.project} 
                uniqueId={item.uniqueId}
                onClick={() => setActiveProject(item)}
            />
        ))}
      </div>

      {/* Expanded Modal View */}
      <AnimatePresence>
        {activeProject && (
            <ExpandedProjectCard 
                project={activeProject.project} 
                uniqueId={activeProject.uniqueId}
                onClose={() => setActiveProject(null)} 
            />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
