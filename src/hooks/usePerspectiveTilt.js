import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * usePerspectiveTilt – High-performance 3D perspective tilt & specular glare hook
 * Adds tactile physical depth to cards and image containers.
 * Gracefully disables on touch devices.
 */
export function usePerspectiveTilt({
  maxTilt = 7,
  scale = 1.018,
  perspective = 1100,
  speed = 400,
  glare = true
} = {}) {
  const elementRef = useRef(null);
  const [style, setStyle] = useState({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: `transform ${speed}ms cubic-bezier(0.16, 1, 0.3, 1)`,
  });
  const [glareStyle, setGlareStyle] = useState({
    opacity: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0%, transparent 60%)',
  });

  const isTouchRef = useRef(false);

  useEffect(() => {
    isTouchRef.current = window.matchMedia('(hover: none)').matches || window.innerWidth < 768;
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isTouchRef.current || !elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setStyle({
      transform: `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'transform 80ms ease-out',
    });

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({
        opacity: 0.85,
        background: `radial-gradient(circle at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, rgba(255,255,255,0.22) 0%, transparent 55%)`,
        transition: 'opacity 150ms ease-out',
      });
    }
  }, [maxTilt, scale, perspective, glare]);

  const handleMouseLeave = useCallback(() => {
    if (isTouchRef.current) return;

    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: `transform ${speed}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    });

    if (glare) {
      setGlareStyle((prev) => ({
        ...prev,
        opacity: 0,
        transition: `opacity ${speed}ms ease`,
      }));
    }
  }, [perspective, speed, glare]);

  return {
    ref: elementRef,
    style,
    glareStyle,
    bind: {
      ref: elementRef,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    }
  };
}
