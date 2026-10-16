'use client';

import React, { useEffect, useRef } from 'react';

export function GrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Create a small offscreen noise pattern
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 128;
    patternCanvas.height = 128;
    const pCtx = patternCanvas.getContext('2d')!;
    const pImg = pCtx.createImageData(128, 128);
    const pData = pImg.data;

    const render = () => {
      // Smooth lerp mouse coordinates
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Subtle radial gold aura around cursor
      const radialGradient = ctx.createRadialGradient(
        mouseX,
        mouseY,
        20,
        mouseX,
        mouseY,
        500
      );
      radialGradient.addColorStop(0, 'rgba(245, 158, 11, 0.045)'); // Kinpaku Gold
      radialGradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.012)');
      radialGradient.addColorStop(1, 'rgba(9, 10, 15, 0)');

      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Refresh noise texture
      for (let i = 0; i < pData.length; i += 4) {
        const val = Math.floor(Math.random() * 255);
        pData[i] = val;
        pData[i + 1] = val;
        pData[i + 2] = val;
        pData[i + 3] = 10; // Very subtle noise alpha
      }
      pCtx.putImageData(pImg, 0, 0);

      // Tile the noise
      ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat')!;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
