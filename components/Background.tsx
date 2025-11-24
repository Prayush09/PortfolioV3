
import React, { useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Points, PointMaterial, Stars, Sparkles, shaderMaterial, Preload } from '@react-three/drei';
import * as THREE from 'three';

// --- 1. Custom Shader for the Black Hole Disc ---
const BlackHoleDiskMaterial = shaderMaterial(
  {
    uTime: 0,
    uInnerColor: new THREE.Color('#ff8080'),
    uOuterColor: new THREE.Color('#3633ff'),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uInnerColor;
    uniform vec3 uOuterColor;
    varying vec2 vUv;

    // Simple pseudo-random noise function
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    // Value Noise for the swirl
    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        // Smooth interpolation
        vec2 u = f * f * (vec2(3.0) - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
        vec3 finalColor = vec3(0.0);
        float iterations = 3.0;

        // Iterate to create layers of swirling rings
        for(float i = 0.0; i < 3.0; i++) {
            float progress = i / (iterations - 1.0);
            
            // Calculate intensity fading based on radial position (vUv.y is radius in CylinderGeometry)
            float intensity = 1.0 - ((vUv.y - progress) * iterations) * 0.5;
            intensity = smoothstep(0.0, 1.0, intensity);

            // Create dynamic swirling UVs
            vec2 noiseUv = vUv;
            noiseUv.x *= 6.0; // Repeat around the ring
            noiseUv.x += uTime * 0.2 / (i + 1.0); // Rotate over time
            noiseUv.y += noise(vec2(noiseUv.x, i * 10.0)) * 0.5; // Distort radially

            // Get noise value
            float noiseVal = noise(noiseUv * vec2(2.0, 10.0));
            
            // Mix colors
            vec3 ringColor = mix(uInnerColor, uOuterColor, progress);
            
            // Additive blending accumulation
            finalColor += ringColor * noiseVal * intensity;
        }

        // Soft edges for the disc (fade out at inner and outer radius)
        float alpha = min(smoothstep(0.0, 0.1, vUv.y), smoothstep(1.0, 0.6, vUv.y));
        
        gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

extend({ BlackHoleDiskMaterial });

// TypeScript definition for the custom material
declare module '@react-three/fiber' {
  interface ThreeElements {
    blackHoleDiskMaterial: any;
  }
}

// --- 2. The Black Hole Component ---
const BlackHole = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
    }

    // Scroll based animation for the Black Hole
    if (typeof window !== 'undefined') {
        const scrollY = window.scrollY;
        const height = window.innerHeight;
        // Guard against division by zero if height is somehow 0
        const progress = height > 0 ? Math.min(scrollY / (height * 1.5), 1) : 0; 

        if (groupRef.current) {
            // Move up as we scroll down
            groupRef.current.position.y = progress * 5; 
        }
    }
  });

  return (
    <group ref={groupRef} position={[7, 0, 0]} scale={3} rotation={[0.5, 0, -0.2]}>
      {/* The Accretion Disk */}
      <mesh>
        <cylinderGeometry args={[5, 1, 0, 64, 10, true]} />
        <blackHoleDiskMaterial 
          ref={materialRef} 
          transparent 
          side={THREE.DoubleSide} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* The Event Horizon (Black Sphere in center) */}
      <mesh scale={[0.95, 0.95, 0.95]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Massive Particle Field */}
      <Sparkles 
        count={2000} 
        scale={12} 
        size={4} 
        speed={0.4} 
        opacity={0.6} 
        color="#3633ff"
      />
      <Sparkles 
        count={1000} 
        scale={8} 
        size={2} 
        speed={0.8} 
        opacity={0.8} 
        color="#ff8080"
      />
    </group>
  );
};

const InteractiveGrid = () => {
  const ref = useRef<THREE.Points>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const count = 4000; // Number of grid points

  // Generate a grid of points
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = 80;
    const rows = 50;
    const separation = 1.5;
    
    for (let i = 0; i < count; i++) {
      const x = (i % cols) * separation - (cols * separation) / 2;
      const y = Math.floor(i / cols) * separation - (rows * separation) / 2;
      const z = 0;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return pos;
  }, []);

  // Store original positions for restoring state
  const originalPositions = useMemo(() => positions.slice(), [positions]);

  useFrame((state) => {
    if (!ref.current) return;

    // Update mouse position in normalized device coordinates (-1 to +1)
    mouse.current.x = state.pointer.x;
    mouse.current.y = state.pointer.y;

    const positionsAttribute = ref.current.geometry.attributes.position;
    
    // Animate points
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = originalPositions[i3];
        const y = originalPositions[i3 + 1];
        
        // Repulsion logic
        const dx = x - (mouse.current.x * 30); 
        const dy = y - (mouse.current.y * 20);
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const forceRadius = 8.0;
        
        if (dist < forceRadius) {
            const force = (forceRadius - dist) / forceRadius;
            const angle = Math.atan2(dy, dx);
            
            const moveDistance = force * 2; 
            
            positionsAttribute.array[i3] = x - Math.cos(angle) * moveDistance;
            positionsAttribute.array[i3 + 1] = y - Math.sin(angle) * moveDistance;
            positionsAttribute.array[i3 + 2] = force * 2; 
        } else {
            positionsAttribute.array[i3] += (x - positionsAttribute.array[i3]) * 0.1;
            positionsAttribute.array[i3 + 1] += (y - positionsAttribute.array[i3 + 1]) * 0.1;
            positionsAttribute.array[i3 + 2] += (0 - positionsAttribute.array[i3 + 2]) * 0.1;
        }
    }
    
    positionsAttribute.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#3b82f6"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
};

const Background: React.FC = () => {
  useEffect(() => {
    // Force a resize event to ensure Canvas calculates dimensions correctly
    // This is crucial for R3F when mounted initially or behind other elements
    const handleResize = () => {
        window.dispatchEvent(new Event('resize'));
    };
    
    // Fire immediately and at intervals to catch any layout shifts
    handleResize();
    const t1 = setTimeout(handleResize, 100);
    const t2 = setTimeout(handleResize, 500);
    const t3 = setTimeout(handleResize, 1000);
    
    return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 w-full h-full bg-[#050505] pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 60 }}
        resize={{ debounce: 0 }} // Immediate resize handling
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
            <color attach="background" args={['#050505']} />
            
            {/* Global Stars */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
            
            {/* Interactive Grid */}
            <InteractiveGrid />
            
            {/* Seamless Black Hole Background Element */}
            <BlackHole />
            
            <ambientLight intensity={0.5} />
            <Preload all />
        </Suspense>
      </Canvas>
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] opacity-80" />
    </div>
  );
};

export default Background;
