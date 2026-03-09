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
  sm: 'w-10 h-14 text-xs',
  md: 'w-14 h-20 text-sm',
  lg: 'w-20 h-28 text-lg',
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
      className={`poker-card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''} ${red ? 'suit-red' : 'suit-black'} ${sizeClasses[size]} flex flex-col items-center justify-between p-1`}
    >
      <span className="font-bold leading-none text-mono">{RANK_DISPLAY[card.rank]}</span>
      <span className="text-[1.2em] leading-none">{SUIT_SYMBOLS[card.suit]}</span>
    </motion.button>
  );
}

interface PlaceholderCardProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PlaceholderCard({ label = '?', size = 'lg' }: PlaceholderCardProps) {
  return (
    <div className={`poker-card ${sizeClasses[size]} flex items-center justify-center border-dashed border-muted-foreground/30 bg-muted/30`}>
      <span className="text-muted-foreground/50 font-semibold">{label}</span>
    </div>
  );
}
