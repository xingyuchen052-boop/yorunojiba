'use client';

import { useEffect, useRef } from 'react';

export default function RainEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置 canvas 尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 雨滴参数
    interface Raindrop {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
    }

    const raindrops: Raindrop[] = [];
    const raindropCount = 100;

    // 初始化雨滴
    for (let i = 0; i < raindropCount; i++) {
      raindrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 10 + 5,
        speed: Math.random() * 5 + 2,
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      raindrops.forEach((raindrop, index) => {
        // 绘制雨滴
        ctx.beginPath();
        ctx.moveTo(raindrop.x, raindrop.y);
        ctx.lineTo(raindrop.x, raindrop.y + raindrop.length);
        ctx.strokeStyle = `rgba(255, 255, 255, ${raindrop.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // 更新雨滴位置
        raindrop.y += raindrop.speed;

        // 重置雨滴
        if (raindrop.y > canvas.height) {
          raindrops[index] = {
            x: Math.random() * canvas.width,
            y: 0,
            length: Math.random() * 10 + 5,
            speed: Math.random() * 5 + 2,
            opacity: Math.random() * 0.3 + 0.1
          };
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    // 清理
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.3 }}
    />
  );
}