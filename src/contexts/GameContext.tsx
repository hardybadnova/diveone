
import React, { createContext, useState, useContext } from 'react';

// Define types for our game data
interface Player {
  id: string;
  username: string;
  stats: {
    wins: number;
    totalPlayed: number;
    winRate: number;
  };
}

interface Pool {
  id: string;
  gameType: 'bluff' | 'topspot' | 'jackpot';
  entryFee: number;
  maxPlayers: number;
  currentPlayers: number;
  status: 'waiting' | 'active' | 'completed';
}

interface GameContextType {
  pools: Pool[];
  currentPool: Pool | null;
  players: Player[];
  joinPool: (poolId: string) => void;
  leavePool: () => void;
  getPoolsByGameType: (gameType: string) => Pool[];
}

// Mock data for pools
const mockPools: Pool[] = [
  // Bluff The Tough pools
  ...([20, 50, 100, 500, 1000, 1500, 2000] as const).map((fee, index) => ({
    id: `bluff-${index}`,
    gameType: 'bluff' as const,
    entryFee: fee,
    maxPlayers: 50,
    currentPlayers: Math.floor(Math.random() * 30) + 5,
    status: 'waiting' as const,
  })),
  
  // Top Spot pools
  ...([20, 50, 100, 500, 1000, 1500, 2000] as const).map((fee, index) => ({
    id: `topspot-${index}`,
    gameType: 'topspot' as const,
    entryFee: fee,
    maxPlayers: 50,
    currentPlayers: Math.floor(Math.random() * 30) + 5,
    status: 'waiting' as const,
  })),
  
  // Jackpot Horse pools
  ...([20, 50] as const).map((fee, index) => ({
    id: `jackpot-${index}`,
    gameType: 'jackpot' as const,
    entryFee: fee,
    maxPlayers: 10000,
    currentPlayers: Math.floor(Math.random() * 5000) + 1000,
    status: 'waiting' as const,
  })),
];

// Generate mock players
const generateMockPlayers = (count: number): Player[] => {
  return Array(count)
    .fill(null)
    .map((_, index) => {
      const wins = Math.floor(Math.random() * 100);
      const totalPlayed = wins + Math.floor(Math.random() * 200);
      return {
        id: `player-${index}`,
        username: `Player${index + 1}`,
        stats: {
          wins,
          totalPlayed,
          winRate: totalPlayed > 0 ? Math.round((wins / totalPlayed) * 100) : 0,
        },
      };
    });
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pools, setPools] = useState<Pool[]>(mockPools);
  const [currentPool, setCurrentPool] = useState<Pool | null>(null);
  const [players] = useState<Player[]>(generateMockPlayers(100));

  const joinPool = (poolId: string) => {
    const pool = pools.find(p => p.id === poolId);
    if (pool) {
      setCurrentPool(pool);
    }
  };

  const leavePool = () => {
    setCurrentPool(null);
  };

  const getPoolsByGameType = (gameType: string) => {
    return pools.filter(pool => pool.gameType === gameType);
  };

  return (
    <GameContext.Provider
      value={{
        pools,
        currentPool,
        players,
        joinPool,
        leavePool,
        getPoolsByGameType,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
