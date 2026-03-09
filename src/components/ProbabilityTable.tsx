import { motion, AnimatePresence } from 'framer-motion';
import { HAND_RANKS, type SimulationResult } from '@/lib/poker';
import { ArrowUp, ArrowDown, User, Users } from 'lucide-react';

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

// Hands that are "collective" (involve community cards heavily)
const COLLECTIVE_HANDS = new Set(['Flush', 'Straight', 'Straight Flush', 'Royal Flush']);

export function ProbabilityTable({ results, previousResults, loading }: ProbabilityTableProps) {
  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        {HAND_RANKS.map((hand, i) => {
          const pct = results?.[hand] ?? 0;
          const prevPct = previousResults?.[hand] ?? 0;
          const delta = results && previousResults ? pct - prevPct : 0;
          const improved = delta > 0.1;
          const worsened = delta < -0.1;
          const barWidth = Math.min(pct, 100);
          const isCollective = COLLECTIVE_HANDS.has(hand);

          return (
            <motion.div
              key={hand}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              {/* Type icon */}
              <div className="w-5 shrink-0 flex justify-center text-muted-foreground/50">
                {isCollective ? <Users className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div className="w-24 sm:w-32 text-xs sm:text-sm font-medium text-secondary-foreground flex items-center gap-1 shrink-0">
                {hand}
              </div>

              <div className="flex-1 probability-bar">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${HAND_COLORS[hand]}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(barWidth, pct > 0 ? 1 : 0)}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </div>

              {/* Percentage */}
              <span className={`w-14 text-right text-xs sm:text-sm font-mono font-semibold ${loading ? 'text-muted-foreground animate-pulse' : improved ? 'text-primary' : worsened ? 'text-destructive' : 'text-secondary-foreground'}`}>
                {results ? (pct < 0.01 && pct > 0 ? '<.01%' : `${pct.toFixed(2)}%`) : '—'}
              </span>

              {/* Delta indicator */}
              <div className="w-14 shrink-0 text-right">
                {results && previousResults && Math.abs(delta) > 0.1 ? (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-semibold ${improved ? 'text-primary' : 'text-destructive'}`}
                  >
                    {improved ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                    {delta > 0 ? '+' : ''}{delta.toFixed(1)}%
                  </motion.span>
                ) : (
                  <span className="text-[10px] text-muted-foreground/30">—</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
