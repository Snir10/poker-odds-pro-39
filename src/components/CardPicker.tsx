import { useState } from 'react';
import { Card, RANKS, SUITS, cardId, SUIT_SYMBOLS, RANK_DISPLAY, isRed } from '@/lib/poker';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CardPickerProps {
  selectedCards: Card[];
  disabledCards: Card[];
  maxSelect: number;
  onToggle: (card: Card) => void;
}

export function CardPicker({ selectedCards, disabledCards, maxSelect, onToggle }: CardPickerProps) {
  const [collapsed, setCollapsed] = useState(false);
  const selectedIds = new Set(selectedCards.map(cardId));
  const disabledIds = new Set(disabledCards.map(cardId));

  return (
    <div className="space-y-2">
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
      >
        {collapsed ? 'Show' : 'Hide'} Cards
        {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-1.5">
              {SUITS.map(suit => (
                <div
                  key={suit}
                  className="flex gap-1 sm:gap-1.5 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
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
                        whileHover={!isDisabled && !atMax ? { scale: 1.12, y: -3 } : undefined}
                        whileTap={!isDisabled && !atMax ? { scale: 0.92 } : undefined}
                        onClick={() => !isDisabled && !atMax && onToggle(card)}
                        disabled={isDisabled || atMax}
                        className={`
                          w-10 h-14 sm:w-11 sm:h-[3.8rem] rounded-lg border text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all duration-150 snap-start shrink-0
                          ${isSelected
                            ? 'bg-primary/20 border-primary shadow-lg shadow-primary/25 ring-2 ring-primary/50 scale-105'
                            : isDisabled || atMax
                              ? 'bg-muted/10 border-border/20 opacity-20 cursor-not-allowed'
                              : 'bg-card border-border/60 hover:border-muted-foreground/50 hover:bg-card/80 cursor-pointer shadow-sm'
                          }
                          ${red ? 'text-[hsl(var(--suit-hearts))]' : 'text-[hsl(var(--suit-clubs))]'}
                        `}
                      >
                        <span className="text-mono leading-none font-extrabold text-[0.85rem]">{RANK_DISPLAY[rank]}</span>
                        <span className="text-[0.75rem] leading-none">{SUIT_SYMBOLS[suit]}</span>
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
