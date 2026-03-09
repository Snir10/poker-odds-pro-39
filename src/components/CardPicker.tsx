import { Card, RANKS, SUITS, cardId, SUIT_SYMBOLS, isRed } from '@/lib/poker';
import { motion } from 'framer-motion';

interface CardPickerProps {
  selectedCards: Card[];
  disabledCards: Card[];
  maxSelect: number;
  onToggle: (card: Card) => void;
}

export function CardPicker({ selectedCards, disabledCards, maxSelect, onToggle }: CardPickerProps) {
  const selectedIds = new Set(selectedCards.map(cardId));
  const disabledIds = new Set(disabledCards.map(cardId));

  return (
    <div className="space-y-1">
      {SUITS.map(suit => (
        <div key={suit} className="flex gap-1 justify-center flex-wrap">
          {RANKS.map(rank => {
            const card: Card = { rank, suit };
            const id = cardId(card);
            const isSelected = selectedIds.has(id);
            const isDisabled = disabledIds.has(id) && !isSelected;
            const atMax = selectedCards.length >= maxSelect && !isSelected;
            const red = isRed(suit);

            return (
              <motion.button
                key={id}
                whileHover={!isDisabled && !atMax ? { scale: 1.15, y: -2 } : undefined}
                whileTap={!isDisabled && !atMax ? { scale: 0.9 } : undefined}
                onClick={() => !isDisabled && !atMax && onToggle(card)}
                disabled={isDisabled || atMax}
                className={`
                  w-8 h-11 sm:w-9 sm:h-12 rounded-md border text-xs font-bold flex flex-col items-center justify-center gap-0 transition-all duration-150
                  ${isSelected
                    ? 'bg-primary/20 border-primary shadow-md shadow-primary/20 ring-1 ring-primary/50'
                    : isDisabled || atMax
                      ? 'bg-muted/20 border-border/30 opacity-25 cursor-not-allowed'
                      : 'bg-card border-border hover:border-muted-foreground/50 cursor-pointer'
                  }
                  ${red ? 'text-[hsl(var(--suit-hearts))]' : 'text-[hsl(var(--suit-clubs))]'}
                `}
              >
                <span className="text-mono leading-none">{rank === 'T' ? '10' : rank}</span>
                <span className="text-[0.7em] leading-none">{SUIT_SYMBOLS[suit]}</span>
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
