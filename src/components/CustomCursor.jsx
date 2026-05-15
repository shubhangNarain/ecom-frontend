import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Position values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for the outer ring
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const outerX = useSpring(cursorX, springConfig);
  const outerY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    // Global listeners for hover detection
    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('input') ||
        target.closest('.cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (typeof window === 'undefined') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Outer Ring */}
      <motion.div
        style={{
          x: outerX,
          y: outerY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 64 : 32,
          height: isHovered ? 64 : 32,
          opacity: isVisible ? 1 : 0,
          backgroundColor: isHovered ? 'rgba(198, 241, 53, 0.2)' : 'transparent',
          border: isHovered ? '2px solid #c6f135' : '1.5px solid rgba(198, 241, 53, 0.4)',
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.8 }}
        className="rounded-full"
      />

      {/* Inner Dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicked ? 0.8 : isHovered ? 1.4 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        className="w-2 h-2 bg-accent rounded-full absolute top-0 left-0 shadow-[0_0_8px_rgba(198,241,53,0.6)]"
      />
    </div>
  );
};

export default CustomCursor;
