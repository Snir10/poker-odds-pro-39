import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/lib/poker';
import { PokerCard, PlaceholderCard } from './PokerCard';

interface TableDisplayProps {
  holeCards: Card[];
  communityCards: Card[];
  stage: number;
}

export function TableDisplay({ holeCards, communityCards, stage }: TableDisplayProps) {
  const communitySlots = [0, 1, 2, 3, 4];
  const stageLabels = ['Select Hole Cards', 'Flop', 'Turn', 'River', 'Complete'];

  return (
    <div className="felt-surface rounded-2xl p-4 sm:p-6 glow-green">
      <div className="text-center mb-3">
        <span className="text-xs uppercase tracking-widest text-[hsl(var(--suit-clubs))]/60 font-medium">
          {stageLabels[stage]}
        </span>
      </div>

      {/* Hole Cards */}
      <div className="flex justify-center gap-2 mb-4">
        <AnimatePresence mode="popLayout">
          {holeCards.length > 0 ? (
            holeCards.map(c => (
              <motion.div
                key={`${c.rank}${c.suit}`}
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <PokerCard card={c} size="lg" />
              </motion.div>
            ))
          ) : (
            <>
              <PlaceholderCard size="lg" />
              <PlaceholderCard size="lg" />
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      {stage >= 1 && (
        <div className="border-t border-[hsl(var(--felt-border))]/50 my-3" />
      )}

      {/* Community Cards */}
      {stage >= 1 && (
        <div className="flex justify-center gap-2">
          <AnimatePresence mode="popLayout">
            {communitySlots.map(i => {
              const card = communityCards[i];
              if (card) {
                return (
                  <motion.div
                    key={`${card.rank}${card.suit}`}
                    initial={{ scale: 0, rotateY: 180 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25, delay: i * 0.1 }}
                  >
                    <PokerCard card={card} size="md" />
                  </motion.div>
                );
              }
              if (
                (i < 3 && stage >= 1) ||
                (i === 3 && stage >= 2) ||
                (i === 4 && stage >= 3)
              ) {
                return <PlaceholderCard key={`ph-${i}`} size="md" />;
              }
              return null;
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
