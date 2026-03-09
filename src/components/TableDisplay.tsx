import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/lib/poker';
import { PokerCard, PlaceholderCard } from './PokerCard';
import { Minus, Plus } from 'lucide-react';

interface TableDisplayProps {
  holeCards: Card[];
  communityCards: Card[];
  stage: number;
  numPlayers: number;
  onPlayersChange: (n: number) => void;
}

function CardBack({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 250, damping: 20 }}
      className="w-8 h-12 sm:w-10 sm:h-14 rounded-lg border-2 border-border bg-gradient-to-br from-primary/30 via-primary/10 to-accent/20 shadow-md flex items-center justify-center"
    >
      <div className="w-5 h-7 sm:w-6 sm:h-9 rounded border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        <span className="text-primary/40 text-[0.5rem] font-bold">♠</span>
      </div>
    </motion.div>
  );
}

export function TableDisplay({ holeCards, communityCards, stage, numPlayers, onPlayersChange }: TableDisplayProps) {
  const stageLabels = ['Select Your Hand', 'Flop', 'Turn', 'River', 'Showdown'];
  const opponents = numPlayers - 1;

  // Position opponents around the table
  const opponentPositions = Array.from({ length: opponents }, (_, i) => {
    const angle = Math.PI + ((i + 1) / (opponents + 1)) * Math.PI;
    const rx = 42;
    const ry = 28;
    return {
      left: `${50 + rx * Math.cos(angle)}%`,
      top: `${48 + ry * Math.sin(angle)}%`,
    };
  });

  return (
    <div className="felt-table relative overflow-hidden rounded-[2rem] p-5 sm:p-8">
      {/* Felt texture overlay */}
      <div className="absolute inset-0 rounded-[2rem] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,255,255,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Player count control */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
        <button
          onClick={() => onPlayersChange(Math.max(2, numPlayers - 1))}
          className="w-6 h-6 rounded-full bg-secondary/60 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="text-[10px] text-emerald-200/50 font-mono min-w-[2.5rem] text-center">
          {numPlayers}P
        </span>
        <button
          onClick={() => onPlayersChange(Math.min(10, numPlayers + 1))}
          className="w-6 h-6 rounded-full bg-secondary/60 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Stage label */}
      <div className="text-center mb-5 relative z-10">
        <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-200/40 font-semibold">
          {stageLabels[stage]}
        </span>
      </div>

      {/* Opponent card backs around table */}
      {opponentPositions.map((pos, idx) => (
        <div
          key={idx}
          className="absolute z-10 flex gap-0.5 -translate-x-1/2 -translate-y-1/2"
          style={{ left: pos.left, top: pos.top }}
        >
          <CardBack index={idx * 2} />
          <CardBack index={idx * 2 + 1} />
        </div>
      ))}

      {/* Community Cards — center */}
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

      {/* Hole Cards */}
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

      <div className="text-center mt-2 relative z-10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-200/30 font-medium">
          Your Hand
        </span>
      </div>
    </div>
  );
}
