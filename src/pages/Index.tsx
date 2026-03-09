import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Shuffle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, cardId, runSimulation, getRandomCards, SimulationResult } from '@/lib/poker';
import { CardPicker } from '@/components/CardPicker';
import { ProbabilityTable } from '@/components/ProbabilityTable';
import { TableDisplay } from '@/components/TableDisplay';
import { SplashScreen } from '@/components/SplashScreen';

type Stage = 0 | 1 | 2 | 3 | 4;

const STAGE_CONFIG: { label: string; pick: number; total: number }[] = [
  { label: 'Select 2 Hole Cards', pick: 2, total: 2 },
  { label: 'Select 3 Flop Cards', pick: 3, total: 3 },
  { label: 'Select Turn Card', pick: 1, total: 4 },
  { label: 'Select River Card', pick: 1, total: 5 },
  { label: 'All Cards Selected', pick: 0, total: 5 },
];

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const [stage, setStage] = useState<Stage>(0);
  const [holeCards, setHoleCards] = useState<Card[]>([]);
  const [communityCards, setCommunityCards] = useState<Card[]>([]);
  const [currentPick, setCurrentPick] = useState<Card[]>([]);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [prevResults, setPrevResults] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [numPlayers, setNumPlayers] = useState(6);
  const workerTimeout = useRef<ReturnType<typeof setTimeout>>();

  const allSelected = [...holeCards, ...communityCards];

  const simulate = useCallback((hole: Card[], community: Card[]) => {
    if (hole.length < 2) return;
    setSimulating(true);
    if (workerTimeout.current) clearTimeout(workerTimeout.current);
    workerTimeout.current = setTimeout(() => {
      const res = runSimulation(hole, community, 50000);
      setPrevResults(prev => results ?? prev);
      setResults(res);
      setSimulating(false);
    }, 50);
  }, [results]);

  const handleToggle = useCallback((card: Card) => {
    setCurrentPick(prev => {
      const id = cardId(card);
      const exists = prev.find(c => cardId(c) === id);
      if (exists) return prev.filter(c => cardId(c) !== id);
      const maxPick = STAGE_CONFIG[stage].pick;
      if (prev.length >= maxPick) return prev;
      return [...prev, card];
    });
  }, [stage]);

  const confirmSelection = useCallback(() => {
    if (stage === 0 && currentPick.length === 2) {
      setHoleCards(currentPick);
      setCurrentPick([]);
      setStage(1);
      simulate(currentPick, []);
    } else if (stage >= 1 && stage <= 3) {
      const newCommunity = [...communityCards, ...currentPick];
      setCommunityCards(newCommunity);
      setCurrentPick([]);
      setStage((stage + 1) as Stage);
      simulate(holeCards, newCommunity);
    }
  }, [stage, currentPick, holeCards, communityCards, simulate]);

  const skipStage = useCallback(() => {
    if (stage >= 1 && stage <= 3) {
      setStage((stage + 1) as Stage);
    }
  }, [stage]);

  const canConfirm = currentPick.length === STAGE_CONFIG[stage].pick;

  const reset = useCallback(() => {
    setStage(0);
    setHoleCards([]);
    setCommunityCards([]);
    setCurrentPick([]);
    setResults(null);
    setPrevResults(null);
  }, []);

  const randomHand = useCallback(() => {
    reset();
    const cards = getRandomCards(2, []);
    setHoleCards(cards);
    setCurrentPick([]);
    setStage(1);
    setTimeout(() => {
      const res = runSimulation(cards, [], 50000);
      setResults(res);
    }, 50);
  }, [reset]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background flex flex-col"
    >
      {/* Header */}
      <header className="border-b border-border px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Poker Odds
          </h1>
          <p className="text-xs text-muted-foreground">Monte Carlo Simulator</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={randomHand}>
            <Shuffle className="w-4 h-4 mr-1" /> Random
          </Button>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4 space-y-4">
        {/* Table Display */}
        <TableDisplay
          holeCards={holeCards}
          communityCards={communityCards}
          stage={stage}
          numPlayers={numPlayers}
          onPlayersChange={setNumPlayers}
        />

        {/* Card Picker */}
        {stage < 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                {STAGE_CONFIG[stage].label}
              </h2>
              <span className="text-xs text-muted-foreground text-mono">
                {currentPick.length}/{STAGE_CONFIG[stage].pick}
              </span>
            </div>

            <CardPicker
              selectedCards={currentPick}
              disabledCards={allSelected}
              maxSelect={STAGE_CONFIG[stage].pick}
              onToggle={handleToggle}
            />

            <div className="flex gap-2">
              <Button
                onClick={confirmSelection}
                disabled={!canConfirm}
                className="flex-1"
                size="sm"
              >
                Confirm <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              {stage >= 1 && stage <= 3 && (
                <Button variant="ghost" size="sm" onClick={skipStage}>
                  Skip
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* Probabilities */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <h2 className="text-sm font-semibold text-foreground">
            Hand Probabilities
            {simulating && <span className="ml-2 text-xs text-muted-foreground animate-pulse">Calculating...</span>}
          </h2>
          <ProbabilityTable results={results} previousResults={prevResults} loading={simulating} />
        </motion.div>
      </main>
    </motion.div>
  );
}
