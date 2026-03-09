import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/lib/poker';
import { PokerCard, PlaceholderCard } from './PokerCard';

interface TableDisplayProps {
  holeCards: Card[];
  communityCards: Card[];
  stage: number;
}

export function TableDisplay({ holeCards, communityCards, stage }: TableDisplayProps) {
  const stageLabels = ['Select Your Hand', 'Flop', 'Turn', 'River', 'Showdown'];

  return (
    <div className="felt-table relative overflow-hidden rounded-[2rem] p-5 sm:p-8">
      {/* Inner felt texture overlay */}
      <div className="absolute inset-0 rounded-[2rem] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,255,255,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Stage label */}
      <div className="text-center mb-5 relative z-10">
        <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-200/40 font-semibold">
          {stageLabels[stage]}
        </span>
      </div>

      {/* Community Cards — center of the table */}
      <div className="relative z-10 flex justify-center items-center gap-1.5 sm:gap-2 mb-6">
        <AnimatePresence mode="popLayout">
          {[0, 1, 2].map(i => {
            const card = communityCards[i];
            if (card) {
              return (
                <motion.div
                  key={`${card.rank}${card.suit}`}
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25, delay: i * 0.08 }}
                >
                  <PokerCard card={card} size="md" />
                </motion.div>
              );
            }
            return <PlaceholderCard key={`flop-${i}`} size="md" label="?" />;
          })}

          {/* Separator between flop and turn/river */}
          <div className="w-1" />

          {/* Turn */}
          {(() => {
            const card = communityCards[3];
            if (card) {
              return (
                <motion.div
                  key={`${card.rank}${card.suit}`}
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <PokerCard card={card} size="md" />
                </motion.div>
              );
            }
            return <PlaceholderCard key="turn-ph" size="md" label="T" />;
          })()}

          {/* River */}
          {(() => {
            const card = communityCards[4];
            if (card) {
              return (
                <motion.div
                  key={`${card.rank}${card.suit}`}
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <PokerCard card={card} size="md" />
                </motion.div>
              );
            }
            return <PlaceholderCard key="river-ph" size="md" label="R" />;
          })()}
        </AnimatePresence>
      </div>

      {/* Divider rail */}
      <div className="relative z-10 mx-auto w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent mb-4" />

      {/* Hole Cards — bottom of table (player position) */}
      <div className="relative z-10 flex justify-center gap-2 sm:gap-3">
        <AnimatePresence mode="popLayout">
          {holeCards.length > 0 ? (
            holeCards.map((c, i) => (
              <motion.div
                key={`${c.rank}${c.suit}`}
                initial={{ scale: 0, y: 40, rotateY: 180 }}
                animate={{ scale: 1, y: 0, rotateY: 0, rotate: i === 0 ? -4 : 4 }}
                exit={{ scale: 0, y: 40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25, delay: i * 0.1 }}
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

      {/* "Your Hand" label */}
      <div className="text-center mt-2 relative z-10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-200/30 font-medium">
          Your Hand
        </span>
      </div>
    </div>
  );
}
