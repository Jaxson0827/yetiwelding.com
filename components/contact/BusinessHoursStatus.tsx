'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function getBusinessStatus(date: Date) {
  const day = date.getDay();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const currentMinutes = hour * 60 + minute;

  if (day === 0) {
    return { isOpen: false, message: 'Closed - Opens Monday at 7:00 AM' };
  }
  if (day === 6) {
    if (currentMinutes >= 8 * 60 && currentMinutes < 12 * 60) {
      return { isOpen: true, message: 'Open - Closes at 12:00 PM' };
    }
    if (currentMinutes < 8 * 60) {
      return { isOpen: false, message: 'Closed - Opens at 8:00 AM' };
    }
    return { isOpen: false, message: 'Closed - Opens Monday at 7:00 AM' };
  }
  if (currentMinutes >= 7 * 60 && currentMinutes < 17 * 60) {
    return { isOpen: true, message: 'Open - Closes at 5:00 PM' };
  }
  if (currentMinutes < 7 * 60) {
    return { isOpen: false, message: 'Closed - Opens at 7:00 AM' };
  }
  return { isOpen: false, message: 'Closed - Opens Tomorrow at 7:00 AM' };
}

interface BusinessHoursStatusProps {
  className?: string;
}

export default function BusinessHoursStatus({ className = '' }: BusinessHoursStatusProps) {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const businessStatus = getBusinessStatus(currentTime);

  return (
    <div className={className}>
      <div
        className="flex w-full items-center gap-3 px-6 py-4 rounded-lg"
        style={{
          background: businessStatus.isOpen
            ? 'rgba(34, 197, 94, 0.1)'
            : 'rgba(239, 68, 68, 0.1)',
          border: businessStatus.isOpen
            ? '1px solid rgba(34, 197, 94, 0.3)'
            : '1px solid rgba(239, 68, 68, 0.3)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
        }}
      >
        <motion.div
          className={`w-3 h-3 flex-shrink-0 rounded-full ${businessStatus.isOpen ? 'bg-green-500' : 'bg-red-500'}`}
          animate={{
            scale: businessStatus.isOpen ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: businessStatus.isOpen ? Infinity : 0,
          }}
        />
        <div className="min-w-0 text-left">
          <p className="text-white/90 font-semibold text-sm uppercase tracking-wider">
            {businessStatus.isOpen ? "We're Open" : "We're Closed"}
          </p>
          <p className="text-white/70 text-xs">{businessStatus.message}</p>
        </div>
      </div>
    </div>
  );
}
