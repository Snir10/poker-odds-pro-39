export type Suit = 'h' | 'd' | 'c' | 's';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  rank: Rank;
  suit: Suit;
}

export const RANKS: Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
export const SUITS: Suit[] = ['s', 'h', 'd', 'c'];

export const SUIT_SYMBOLS: Record<Suit, string> = { h: '♥', d: '♦', c: '♣', s: '♠' };
export const SUIT_NAMES: Record<Suit, string> = { h: 'Hearts', d: 'Diamonds', c: 'Clubs', s: 'Spades' };

export const RANK_VALUES: Record<Rank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
  '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14,
};

export const RANK_DISPLAY: Record<Rank, string> = {
  '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8',
  '9': '9', 'T': '10', 'J': 'J', 'Q': 'Q', 'K': 'K', 'A': 'A',
};

export function cardId(c: Card): string {
  return `${c.rank}${c.suit}`;
}

export function isRed(suit: Suit): boolean {
  return suit === 'h' || suit === 'd';
}

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

export type HandRank =
  | 'Royal Flush'
  | 'Straight Flush'
  | 'Four of a Kind'
  | 'Full House'
  | 'Flush'
  | 'Straight'
  | 'Three of a Kind'
  | 'Two Pair'
  | 'Pair'
  | 'High Card';

export const HAND_RANKS: HandRank[] = [
  'Royal Flush',
  'Straight Flush',
  'Four of a Kind',
  'Full House',
  'Flush',
  'Straight',
  'Three of a Kind',
  'Two Pair',
  'Pair',
];

function evaluateBestHand(cards: Card[]): HandRank {
  // Generate all 5-card combinations from 5-7 cards
  const combos = combinations(cards, 5);
  let best: HandRank = 'High Card';
  const rankOrder = [...HAND_RANKS].reverse(); // Pair first

  for (const combo of combos) {
    const hand = classifyHand(combo);
    if (rankOrder.indexOf(hand) > rankOrder.indexOf(best) || best === 'High Card') {
      if (hand !== 'High Card' && (best === 'High Card' || rankOrder.indexOf(hand) > rankOrder.indexOf(best))) {
        best = hand;
      }
    }
  }
  return best;
}

function combinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [first, ...rest] = arr;
  const withFirst = combinations(rest, k - 1).map(c => [first, ...c]);
  const withoutFirst = combinations(rest, k);
  return [...withFirst, ...withoutFirst];
}

function classifyHand(cards: Card[]): HandRank {
  const values = cards.map(c => RANK_VALUES[c.rank]).sort((a, b) => a - b);
  const suits = cards.map(c => c.suit);

  const isFlush = suits.every(s => s === suits[0]);

  // Check straight
  let isStraight = false;
  const unique = [...new Set(values)].sort((a, b) => a - b);
  if (unique.length === 5) {
    if (unique[4] - unique[0] === 4) isStraight = true;
    // Ace-low straight (A-2-3-4-5)
    if (unique[0] === 2 && unique[1] === 3 && unique[2] === 4 && unique[3] === 5 && unique[4] === 14) {
      isStraight = true;
    }
  }

  // Count ranks
  const counts: Record<number, number> = {};
  for (const v of values) counts[v] = (counts[v] || 0) + 1;
  const freq = Object.values(counts).sort((a, b) => b - a);

  if (isFlush && isStraight) {
    if (unique[0] === 10 && unique[4] === 14) return 'Royal Flush';
    return 'Straight Flush';
  }
  if (freq[0] === 4) return 'Four of a Kind';
  if (freq[0] === 3 && freq[1] === 2) return 'Full House';
  if (isFlush) return 'Flush';
  if (isStraight) return 'Straight';
  if (freq[0] === 3) return 'Three of a Kind';
  if (freq[0] === 2 && freq[1] === 2) return 'Two Pair';
  if (freq[0] === 2) return 'Pair';
  return 'High Card';
}

export interface SimulationResult {
  [key: string]: number;
}

export function runSimulation(
  holeCards: Card[],
  communityCards: Card[],
  iterations: number = 50000
): SimulationResult {
  const result: SimulationResult = {};
  for (const hand of HAND_RANKS) result[hand] = 0;

  const usedIds = new Set([...holeCards, ...communityCards].map(cardId));
  const remaining = createDeck().filter(c => !usedIds.has(cardId(c)));
  const cardsNeeded = 5 - communityCards.length;

  for (let i = 0; i < iterations; i++) {
    // Fisher-Yates partial shuffle
    const deck = [...remaining];
    for (let j = 0; j < cardsNeeded; j++) {
      const k = j + Math.floor(Math.random() * (deck.length - j));
      [deck[j], deck[k]] = [deck[k], deck[j]];
    }

    const simCommunity = [...communityCards, ...deck.slice(0, cardsNeeded)];
    const allCards = [...holeCards, ...simCommunity];
    const best = evaluateBestHand(allCards);
    if (best !== 'High Card') result[best]++;
  }

  // Convert to percentages
  for (const hand of HAND_RANKS) {
    result[hand] = (result[hand] / iterations) * 100;
  }

  return result;
}

export function getRandomCards(count: number, exclude: Card[]): Card[] {
  const excludeIds = new Set(exclude.map(cardId));
  const available = createDeck().filter(c => !excludeIds.has(cardId(c)));
  // Shuffle
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }
  return available.slice(0, count);
}
