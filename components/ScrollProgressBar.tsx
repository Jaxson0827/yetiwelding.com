 'use client';
 
 import { useEffect, useState } from 'react';
 
 export default function ScrollProgressBar() {
   const [scrollProgress, setScrollProgress] = useState(0);
 
   useEffect(() => {
     let raf = 0;
 
     const update = () => {
       const scrollPx = document.documentElement.scrollTop;
       const winHeightPx =
         document.documentElement.scrollHeight - document.documentElement.clientHeight;
 
       const raw = winHeightPx > 0 ? (scrollPx / winHeightPx) * 100 : 0;
       const clamped = Math.min(100, Math.max(0, raw));
       setScrollProgress(clamped);
     };
 
     const onScroll = () => {
       cancelAnimationFrame(raf);
       raf = requestAnimationFrame(update);
     };
 
     update();
     window.addEventListener('scroll', onScroll, { passive: true });
     window.addEventListener('resize', onScroll);
 
     return () => {
       cancelAnimationFrame(raf);
       window.removeEventListener('scroll', onScroll);
       window.removeEventListener('resize', onScroll);
     };
   }, []);
 
   return (
     <div
       className="scroll-progress"
       style={{ width: `${scrollProgress}%` }}
       aria-hidden="true"
     />
   );
 }

