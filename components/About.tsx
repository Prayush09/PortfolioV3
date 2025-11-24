import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Globe, GraduationCap, Server, Terminal, Zap, Database, Layers, Cpu, Sparkles } from 'lucide-react';
import TextReveal from './TextReveal';

// Data for the sphere
const sphereItems = [
  { icon: Code2, label: 'Go', type: 'Language', color: 'blue' },
  { icon: Code2, label: 'TypeScript', type: 'Language', color: 'blue' },
  { icon: Terminal, label: 'Java', type: 'Language', color: 'blue' },
  { icon: Zap, label: 'React', type: 'Framework', color: 'red' },
  { icon: Zap, label: 'Next.js', type: 'Framework', color: 'red' },
  { icon: Server, label: 'Node.js', type: 'Runtime', color: 'red' },
  { icon: Server, label: 'GCP', type: 'Cloud', color: 'blue' },
  { icon: Layers, label: 'Docker', type: 'DevOps', color: 'blue' },
  { icon: Database, label: 'PostgreSQL', type: 'Database', color: 'blue' },
  { icon: GraduationCap, label: 'VIT-AP', type: '2025', color: 'blue' },
  { icon: Globe, label: 'Bangalore', type: 'India', color: 'red' },
  { icon: Cpu, label: 'Audio DSP', type: 'Specialty', color: 'red' },
];

const About: React.FC = () => {
  return (
    <section id="about" className="min-h-screen py-32 px-6 relative z-10 overflow-hidden flex flex-col items-center justify-center bg-transparent">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Bio & Narrative */}
        <div className="z-20">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
            >
                <TextReveal text="About Me" className="text-4xl md:text-6xl font-display font-bold mb-6 text-white" />
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-red-500 rounded-full mb-8"></div>
                
                <div className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Terminal size={24} /></span>
                    <TextReveal text="Debugging the Universe" />
                </div>
                
                <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                    <p>
                        I’m a <span className="text-white font-medium">Software Engineer</span> driven by the thrill of solving complex problems. My journey involves everything from implementing custom <span className="text-blue-400">FFT algorithms</span> for audio processing to architecting scalable cloud solutions on GCP.
                    </p>
                    <p>
                        Whether it's building AI-powered tools like <span className="text-white">ResuNest</span> or real-time collaboration platforms like <span className="text-white">ZiDraw</span>, I focus on merging robust backend logic with creative, interactive frontends.
                    </p>
                </div>
            </motion.div>
        </div>

        {/* Right: Revolving Sphere Catalog */}
        <div className="h-[500px] md:h-[600px] w-full flex items-center justify-center relative perspective-1000">
           <RevolvingSphere items={sphereItems} />
        </div>

      </div>
    </section>
  );
};

// --- 3D Math & Sphere Logic ---

const RevolvingSphere: React.FC<{ items: typeof sphereItems }> = ({ items }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    
    // Velocity based rotation
    const rotationSpeed = useRef({ x: 0.003, y: 0.003 }); // Base speed
    
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Map mouse position to rotation velocity
        // Center = slow/stable, Edges = fast spin
        rotationSpeed.current = {
            x: y * 0.0001,
            y: x * 0.0001
        };
    };

    useEffect(() => {
        let animationFrameId: number;
        
        const animate = () => {
            if (!isHovering) {
                setRotation(prev => ({
                    x: prev.x + rotationSpeed.current.x,
                    y: prev.y + rotationSpeed.current.y
                }));
            }
            animationFrameId = requestAnimationFrame(animate);
        };
        
        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, [isHovering]);

    // Fibonacci Sphere Distribution
    const radius = 220; // Radius of the sphere in pixels
    const cards = useMemo(() => {
        return items.map((item, index) => {
            const phi = Math.acos(-1 + (2 * index) / items.length);
            const theta = Math.sqrt(items.length * Math.PI) * phi;

            return {
                item,
                initialPos: {
                    x: radius * Math.cos(theta) * Math.sin(phi),
                    y: radius * Math.sin(theta) * Math.sin(phi),
                    z: radius * Math.cos(phi)
                }
            };
        });
    }, [items]);

    return (
        <div 
            ref={containerRef} 
            className="w-full h-full relative flex items-center justify-center cursor-grab active:cursor-grabbing"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(false)} // Keep spinning but interactive
            onMouseLeave={() => rotationSpeed.current = { x: 0.003, y: 0.003 }} // Reset speed on leave
        >
            {cards.map((card, i) => (
                <SphereCard 
                    key={i} 
                    {...card} 
                    rotation={rotation} 
                    onHover={setIsHovering}
                />
            ))}
            
            {/* Central Core Glow */}
            <div className="absolute w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>
    );
};

const SphereCard: React.FC<{ 
    item: typeof sphereItems[0], 
    initialPos: { x: number, y: number, z: number }, 
    rotation: { x: number, y: number },
    onHover: (hover: boolean) => void
}> = ({ item, initialPos, rotation, onHover }) => {
    const Icon = item.icon;

    // Apply Rotation Matrix
    // Rotate around X axis
    const y1 = initialPos.y * Math.cos(rotation.x) - initialPos.z * Math.sin(rotation.x);
    const z1 = initialPos.y * Math.sin(rotation.x) + initialPos.z * Math.cos(rotation.x);
    
    // Rotate around Y axis
    const x2 = initialPos.x * Math.cos(rotation.y) + z1 * Math.sin(rotation.y);
    const z2 = -initialPos.x * Math.sin(rotation.y) + z1 * Math.cos(rotation.y);

    // Perspective Projection
    const perspective = 800;
    const scale = perspective / (perspective - z2);
    const alpha = (z2 + 220) / 440; // Normalized Z for opacity/blur (approx radius * 2)
    
    const x2d = x2 * scale;
    const y2d = y1 * scale;
    const zIndex = Math.floor(scale * 1000);

    // Visibility check - optimization
    const opacity = Math.max(0.1, alpha);
    const blur = (1 - alpha) * 4;

    return (
        <div
            className="absolute top-1/2 left-1/2 will-change-transform"
            style={{
                transform: `translate3d(${x2d}px, ${y2d}px, 0) translate(-50%, -50%) scale(${scale})`,
                zIndex: zIndex,
                opacity: opacity,
                filter: `blur(${blur}px)`,
            }}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
        >
            <div className={`
                flex flex-col items-center justify-center gap-2
                w-28 h-32 rounded-xl backdrop-blur-md
                border transition-all duration-300
                ${item.color === 'blue' 
                    ? 'bg-blue-950/30 border-blue-500/20 hover:border-blue-500/60 hover:bg-blue-900/50' 
                    : 'bg-red-950/30 border-red-500/20 hover:border-red-500/60 hover:bg-red-900/50'
                }
                shadow-lg group cursor-pointer
            `}>
                <div className={`
                    p-2.5 rounded-full 
                    ${item.color === 'blue' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}
                    group-hover:scale-110 transition-transform duration-300
                `}>
                    <Icon size={24} />
                </div>
                
                <div className="text-center">
                    <div className="text-white font-bold text-sm">{item.label}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">{item.type}</div>
                </div>
            </div>
        </div>
    );
};

export default About;