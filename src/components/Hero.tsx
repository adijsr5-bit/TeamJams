'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Transform values for "polluted to clean" effect
  const filterBlur = useTransform(scrollYProgress, [0, 0.5], ['blur(8px)', 'blur(0px)']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.7, 0.1]);
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background visual layers */}
      <motion.div 
        className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"
        style={{ y: yParallax, filter: filterBlur }}
      />
      
      {/* Cinematic Overlays */}
      <motion.div 
        className="absolute inset-0 z-1 bg-brand-slate/90 mix-blend-multiply"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute inset-0 z-2 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark" />
      <div className="absolute inset-0 z-2 bg-gradient-to-r from-brand-dark via-brand-dark/50 to-transparent" />

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col items-start"
        style={{ opacity: opacityFade }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-green/30 bg-brand-green/10 backdrop-blur-md mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          <span className="text-sm font-medium text-brand-green-light">Jamshedpur's Active Movement</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-brand-light max-w-4xl leading-[1.1] break-words hyphens-auto"
        >
          Clean the city, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-400">
            together.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-lg md:text-xl text-brand-muted max-w-2xl leading-relaxed"
        >
          TeamJams is a civic movement platform for organizing cleanups, tracking impact, and building transparent community action. Join the movement to restore our local environment.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-6"
        >
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] group">
            Find an Event
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex items-center gap-4 text-brand-muted">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-dark bg-brand-slate overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Volunteer" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-sm font-medium">
              <span className="text-brand-light block font-bold">2,400+</span>
              volunteers active
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest text-brand-muted font-medium">Scroll to see impact</span>
        <div className="w-px h-12 bg-gradient-to-b from-brand-green/50 to-transparent" />
      </motion.div>
    </section>
  );
}
