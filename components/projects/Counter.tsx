'use client';

import { useState, useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
  prefix?: string;
  className?: string;
}

export default function Counter({
  end,
  suffix = '',
  duration = 2,
  prefix = '',
  className,
}: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return (
    <div
      ref={ref}
      className={className ?? 'text-4xl md:text-5xl font-bold text-[#DC143C] mb-2 leading-none'}
    >
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}
