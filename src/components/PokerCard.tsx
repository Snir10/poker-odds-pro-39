import { motion } from 'framer-motion';
import { Card, RANK_DISPLAY, SUIT_SYMBOLS, isRed } from '@/lib/poker';

interface PokerCardProps {
  card: Card;
  selected?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-11 h-16 text-xs',
  md: 'w-14 h-20 text-sm',
  lg: 'w-[4.5rem] h-[6.3rem] text-base',
};

export function PokerCard({ card, selected, disabled, size = 'md', onClick }: PokerCardProps) {
  const red = isRed(card.suit);

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.08, y: -2 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      layout
      onClick={onClick}
      disabled={disabled}
      className={`poker-card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''} ${red ? 'suit-red' : 'suit-black'} ${sizeClasses[size]} flex flex-col items-start justify-between p-1.5 sm:p-2`}
    >
      <div className="flex flex-col items-center leading-none">
        <span className="font-extrabold text-mono">{RANK_DISPLAY[card.rank]}</span>
        <span className="text-[0.75em]">{SUIT_SYMBOLS[card.suit]}</span>
      </div>
      <span className="self-center text-[1.6em] leading-none opacity-80">{SUIT_SYMBOLS[card.suit]}</span>
    </motion.button>
  );
}

interface PlaceholderCardProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PlaceholderCard({ label = '?', size = 'lg' }: PlaceholderCardProps) {
  return (
    <div className={`poker-card ${sizeClasses[size]} flex items-center justify-center border-dashed border-muted-foreground/20 bg-secondary/20 backdrop-blur-sm`}>
      <span className="text-muted-foreground/30 font-semibold text-lg">{label}</span>
    </div>
  );
}
