import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export const SparklesCore = (props: {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
}) => {
  const {
    id,
    className,
    background = "transparent",
    minSize = 0.4,
    maxSize = 1,
    particleDensity = 100,
    particleColor = "#FFFFFF",
  } = props;
  const [init, setInit] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setInit(true);
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let animationId: number;
      let particles: Particle[] = [];

      const resizeCanvas = () => {
        // Use parent element size or window size
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        } else {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        initParticles();
      };

      class Particle {
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        opacity: number;
        opacitySpeed: number;

        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * (maxSize - minSize) + minSize;
          this.speedX = Math.random() * 0.5 - 0.25;
          this.speedY = Math.random() * 0.5 - 0.25;
          this.opacity = Math.random();
          this.opacitySpeed = Math.random() * 0.02 + 0.005;
        }

        update() {
          this.x += this.speedX;
          this.y += this.speedY;

          if (this.x > canvas.width) this.x = 0;
          if (this.x < 0) this.x = canvas.width;
          if (this.y > canvas.height) this.y = 0;
          if (this.y < 0) this.y = canvas.height;

          this.opacity += this.opacitySpeed;
          if (this.opacity > 1 || this.opacity < 0) {
            this.opacitySpeed *= -1;
          }
        }

        draw() {
          if (!ctx) return;
          ctx.fillStyle = particleColor;
          ctx.globalAlpha = Math.abs(this.opacity);
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const initParticles = () => {
        particles = [];
        const area = canvas.width * canvas.height;
        const count = Math.floor((area / 10000) * (particleDensity / 10));
        for (let i = 0; i < count; i++) {
          particles.push(new Particle());
        }
      };

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          p.update();
          p.draw();
        });
        animationId = requestAnimationFrame(animate);
      };

      resizeCanvas();
      animate();
      
      // Use ResizeObserver for better responsiveness in containers
      const resizeObserver = new ResizeObserver(() => {
         resizeCanvas();
      });
      if (canvas.parentElement) {
         resizeObserver.observe(canvas.parentElement);
      }

      return () => {
        cancelAnimationFrame(animationId);
        resizeObserver.disconnect();
      };
    }
  }, [maxSize, minSize, particleColor, particleDensity, init]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={className}
    >
      <canvas
        ref={canvasRef}
        id={id}
        style={{
          background: background,
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
};

export default SparklesCore;