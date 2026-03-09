import { motion, AnimatePresence } from 'framer-motion';
import { HAND_RANKS, type SimulationResult } from '@/lib/poker';
import { ArrowUp } from 'lucide-react';

interface ProbabilityTableProps {
  results: SimulationResult | null;
  previousResults: SimulationResult | null;
  loading?: boolean;
}

const HAND_COLORS: Record<string, string> = {
  'Royal Flush': 'from-amber-400 to-yellow-500',
  'Straight Flush': 'from-amber-500 to-orange-500',
  'Four of a Kind': 'from-red-500 to-pink-500',
  'Full House': 'from-purple-500 to-violet-500',
  'Flush': 'from-blue-500 to-cyan-500',
  'Straight': 'from-teal-500 to-emerald-500',
  'Three of a Kind': 'from-emerald-500 to-green-500',
  'Two Pair': 'from-green-500 to-lime-500',
  'Pair': 'from-lime-500 to-green-400',
};

export function ProbabilityTable({ results, previousResults, loading }: ProbabilityTableProps) {
  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        {HAND_RANKS.map((hand, i) => {
          const pct = results?.[hand] ?? 0;
          const prevPct = previousResults?.[hand] ?? 0;
          const improved = results && previousResults && pct > prevPct + 0.1;
          const barWidth = Math.min(pct, 100);

          return (
            <motion.div
              key={hand}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3"
            >
              <div className="w-28 sm:w-36 text-xs sm:text-sm font-medium text-secondary-foreground flex items-center gap-1 shrink-0">
                {hand}
                {improved && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-primary"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </motion.span>
                )}
              </div>
              <div className="flex-1 probability-bar">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${HAND_COLORS[hand]}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(barWidth, pct > 0 ? 1 : 0)}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </div>
              <span className={`w-16 text-right text-xs sm:text-sm font-mono font-semibold ${loading ? 'text-muted-foreground animate-pulse' : improved ? 'text-primary' : 'text-secondary-foreground'}`}>
                {results ? (pct < 0.01 && pct > 0 ? '<0.01%' : `${pct.toFixed(2)}%`) : '—'}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
