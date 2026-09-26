import React, { useEffect, useRef } from 'react';
import styles from './AmbientGleam.module.css';

/**
 * AmbientGleam – Architectural 3D lighting system.
 * Simulates a soft specular studio spotlight gliding over obsidian automotive surfaces.
 */
export default function AmbientGleam() {
  const gleamRef = useRef(null);
  const posRef = useRef({ x: window.innerWidth / 2, y: 300, targetX: window.innerWidth / 2, targetY: 300 });

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) return;

    const handleMouseMove = (e) => {
      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId;
    const updatePosition = () => {
      const p = posRef.current;
      p.x += (p.targetX - p.x) * 0.08;
      p.y += (p.targetY - p.y) * 0.08;

      if (gleamRef.current) {
        gleamRef.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={styles.gleamWrapper} aria-hidden="true">
      <div ref={gleamRef} className={styles.gleamSpot} />
      <div className={styles.depthNoise} />
    </div>
  );
}
