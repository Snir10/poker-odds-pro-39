import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => onComplete(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background glow */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            background: 'radial-gradient(ellipse 60% 40% at 50% 50%, hsl(145 60% 45% / 0.08) 0%, transparent 70%)',
          }}
        />

        {/* Card fan animation */}
        <div className="relative mb-8">
          {['♠', '♥', '♦', '♣'].map((suit, i) => (
            <motion.div
              key={suit}
              className="absolute top-0 left-1/2 w-16 h-24 rounded-xl border-2 border-border bg-card flex items-center justify-center text-3xl shadow-xl"
              initial={{ opacity: 0, x: '-50%', y: 40, rotate: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                x: '-50%',
                y: 0,
                rotate: (i - 1.5) * 12,
                scale: 1,
              }}
              transition={{ delay: 0.1 + i * 0.12, type: 'spring', stiffness: 200, damping: 18 }}
              style={{
                color: i === 1 || i === 2 ? 'hsl(var(--suit-hearts))' : 'hsl(var(--suit-clubs))',
                transformOrigin: 'bottom center',
              }}
            >
              {suit}
            </motion.div>
          ))}
        </div>

        {/* Logo text */}
        <motion.div
          className="relative z-10 mt-28 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Poker <span className="text-primary">Odds</span>
          </h1>
          <motion.p
            className="text-sm text-muted-foreground mt-1 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            Monte Carlo Simulator
          </motion.p>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          className="mt-8 flex gap-1.5"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
