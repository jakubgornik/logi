"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

export function InteractiveDots() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue<number>(0);
  const mouseY = useMotionValue<number>(0);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let idleTimeoutId: NodeJS.Timeout;

    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    const resetIdleTimer = () => {
      setIsIdle(false);
      if (idleTimeoutId) clearTimeout(idleTimeoutId);

      idleTimeoutId = setTimeout(() => {
        setIsIdle(true);
      }, 1000);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
        resetIdleTimer();
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    window.addEventListener("mousemove", handleMouseMove);

    resetIdleTimer();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", updateDimensions);
      if (idleTimeoutId) clearTimeout(idleTimeoutId);
    };
  }, [mouseX, mouseY]);

  const dots = [];
  const dotSize = 80;
  const cols = Math.ceil(dimensions.width / dotSize);
  const rows = Math.ceil(dimensions.height / dotSize);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      dots.push({
        x: j * dotSize + 40,
        y: i * dotSize + 40,
        key: `${i}-${j}`,
      });
    }
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none opacity-30"
    >
      {dots.map((dot) => (
        <InteractiveDot
          key={dot.key}
          x={dot.x}
          y={dot.y}
          mouseX={mouseX}
          mouseY={mouseY}
          isIdle={isIdle}
        />
      ))}
    </div>
  );
}

interface InteractiveDotProps {
  x: number;
  y: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  isIdle: boolean;
}

function InteractiveDot({ x, y, mouseX, mouseY, isIdle }: InteractiveDotProps) {
  const [lastActivated, setLastActivated] = useState<number>(0);
  const [isInTrail, setIsInTrail] = useState<boolean>(false);

  const distance = useTransform([mouseX, mouseY], (values: number[]) =>
    Math.sqrt((values[0] - x) ** 2 + (values[1] - y) ** 2)
  );

  const springOpacity = useSpring(0.25, { damping: 25, stiffness: 200 });
  const springScale = useSpring(1, { damping: 25, stiffness: 200 });

  // Handle idle state
  useEffect(() => {
    if (isIdle) {
      setIsInTrail(false);
      springOpacity.set(0.25);
      springScale.set(0.8);
    }
  }, [isIdle, springOpacity, springScale]);

  useEffect(() => {
    let trailTimeoutId: NodeJS.Timeout;

    const unsubscribe = distance.on("change", (latest) => {
      // Don't process if idle
      if (isIdle) return;

      const now = Date.now();

      if (latest < 200) {
        // Currently being hovered
        setLastActivated(now);
        setIsInTrail(true);

        // Immediate activation
        springOpacity.set(0.6);
        springScale.set(1.5);

        // Clear any existing trail timeout
        if (trailTimeoutId) clearTimeout(trailTimeoutId);
      } else if (isInTrail) {
        // Not being hovered but was recently activated
        const timeSinceActivation = now - lastActivated;

        if (timeSinceActivation < 100) {
          // Small buffer to prevent flickering
          if (trailTimeoutId) clearTimeout(trailTimeoutId);

          trailTimeoutId = setTimeout(() => {
            // Start trail fade
            springOpacity.set(0.45);
            springScale.set(1.3);

            // Final fade after shorter trail duration
            setTimeout(() => {
              setIsInTrail(false);
              springOpacity.set(0.25);
              springScale.set(1);
            }, 500);
          }, 150);
        }
      } else {
        // Not in trail, return to default immediately
        springOpacity.set(0.25);
        springScale.set(1);
      }
    });

    return () => {
      unsubscribe();
      if (trailTimeoutId) clearTimeout(trailTimeoutId);
    };
  }, [distance, springOpacity, springScale, lastActivated, isInTrail, isIdle]);

  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-white"
      style={{
        left: x,
        top: y,
        opacity: springOpacity,
        scale: springScale,
      }}
    />
  );
}
