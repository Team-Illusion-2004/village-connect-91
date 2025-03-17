
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

type KarmaContextType = {
  karmaPoints: number;
  awardKarma: (points: number, reason: string) => void;
  karmaHistory: KarmaHistoryItem[];
};

type KarmaHistoryItem = {
  id: string;
  points: number;
  reason: string;
  timestamp: Date;
};

const KarmaContext = createContext<KarmaContextType | undefined>(undefined);

export const useKarma = () => {
  const context = useContext(KarmaContext);
  if (context === undefined) {
    throw new Error('useKarma must be used within a KarmaProvider');
  }
  return context;
};

export const KarmaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [karmaPoints, setKarmaPoints] = useState<number>(0);
  const [karmaHistory, setKarmaHistory] = useState<KarmaHistoryItem[]>([]);

  // Initialize or load karma from storage/API
  useEffect(() => {
    if (!user) return;

    // For now using localStorage, would be replaced with API call
    const storedKarma = localStorage.getItem(`karma_${user.id}`);
    if (storedKarma) {
      setKarmaPoints(JSON.parse(storedKarma));
    } else {
      setKarmaPoints(0);
    }

    const storedHistory = localStorage.getItem(`karma_history_${user.id}`);
    if (storedHistory) {
      setKarmaHistory(JSON.parse(storedHistory).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })));
    }
  }, [user]);

  // Award karma points to user
  const awardKarma = (points: number, reason: string) => {
    if (!user) return;
    
    const newTotal = karmaPoints + points;
    setKarmaPoints(newTotal);
    
    const newHistoryItem: KarmaHistoryItem = {
      id: crypto.randomUUID(),
      points,
      reason,
      timestamp: new Date()
    };
    
    const updatedHistory = [...karmaHistory, newHistoryItem];
    setKarmaHistory(updatedHistory);
    
    // Save to localStorage (would be replaced with API call)
    localStorage.setItem(`karma_${user.id}`, JSON.stringify(newTotal));
    localStorage.setItem(`karma_history_${user.id}`, JSON.stringify(updatedHistory));
    
    // Show toast notification
    toast({
      title: points > 0 ? "Karma Points Earned!" : "Karma Points Deducted",
      description: `${points > 0 ? '+' : ''}${points} karma points: ${reason}`,
      variant: points > 0 ? "default" : "destructive",
    });
  };

  const value = {
    karmaPoints,
    awardKarma,
    karmaHistory
  };

  return <KarmaContext.Provider value={value}>{children}</KarmaContext.Provider>;
};
