import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  goldReward: number;
  gemReward?: number;
  requirements: string[];
  progress: number;
  maxProgress: number;
  completed: boolean;
  expiresAt?: Date;
  classBonus?: string[]; // Classes that get bonus rewards
}

interface QuestContextType {
  quests: Quest[];
  loading: boolean;
  completeQuest: (questId: string) => Promise<void>;
  updateQuestProgress: (questId: string, progress: number) => Promise<void>;
  refreshQuests: () => Promise<void>;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

const QUESTS_STORAGE_KEY = '@questagram_quests';

// Sample quests data
const generateDailyQuests = (): Quest[] => [
  {
    id: 'daily_post',
    title: 'Share Your Adventure',
    description: 'Post a photo or video to share your journey',
    type: 'daily',
    difficulty: 'easy',
    xpReward: 50,
    goldReward: 25,
    requirements: ['Create 1 post'],
    progress: 0,
    maxProgress: 1,
    completed: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  },
  {
    id: 'daily_interact',
    title: 'Spread Kindness',
    description: 'Like and comment on other adventurers\' posts',
    type: 'daily',
    difficulty: 'easy',
    xpReward: 30,
    goldReward: 15,
    requirements: ['Like 5 posts', 'Comment on 3 posts'],
    progress: 0,
    maxProgress: 8,
    completed: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    id: 'daily_login',
    title: 'Daily Devotion',
    description: 'Log in to Questagram every day this week',
    type: 'daily',
    difficulty: 'easy',
    xpReward: 20,
    goldReward: 10,
    gemReward: 1,
    requirements: ['Log in for 1 day'],
    progress: 1,
    maxProgress: 1,
    completed: true,
  }
];

const generateWeeklyQuests = (): Quest[] => [
  {
    id: 'weekly_warrior',
    title: 'Warrior\'s Challenge',
    description: 'Complete fitness-related activities',
    type: 'weekly',
    difficulty: 'medium',
    xpReward: 200,
    goldReward: 100,
    gemReward: 5,
    requirements: ['Post 3 fitness photos', 'Get 50 likes on fitness content'],
    progress: 0,
    maxProgress: 53,
    completed: false,
    classBonus: ['warrior'],
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  },
  {
    id: 'weekly_mage',
    title: 'Scholar\'s Pursuit',
    description: 'Share knowledge and creativity',
    type: 'weekly',
    difficulty: 'medium',
    xpReward: 200,
    goldReward: 100,
    gemReward: 5,
    requirements: ['Post 3 educational/art content', 'Help 10 people with comments'],
    progress: 0,
    maxProgress: 13,
    completed: false,
    classBonus: ['mage'],
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  }
];

export const QuestProvider = ({ children }: { children: ReactNode }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async () => {
    try {
      const storedQuests = await AsyncStorage.getItem(QUESTS_STORAGE_KEY);
      if (storedQuests) {
        const questData = JSON.parse(storedQuests).map((quest: any) => ({
          ...quest,
          expiresAt: quest.expiresAt ? new Date(quest.expiresAt) : undefined
        }));
        setQuests(questData);
      } else {
        // Generate initial quests
        const initialQuests = [...generateDailyQuests(), ...generateWeeklyQuests()];
        setQuests(initialQuests);
        await AsyncStorage.setItem(QUESTS_STORAGE_KEY, JSON.stringify(initialQuests));
      }
    } catch (error) {
      console.error('Error loading quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveQuests = async (updatedQuests: Quest[]) => {
    try {
      await AsyncStorage.setItem(QUESTS_STORAGE_KEY, JSON.stringify(updatedQuests));
      setQuests(updatedQuests);
    } catch (error) {
      console.error('Error saving quests:', error);
    }
  };

  const completeQuest = async (questId: string) => {
    const updatedQuests = quests.map(quest => 
      quest.id === questId 
        ? { ...quest, completed: true, progress: quest.maxProgress }
        : quest
    );
    await saveQuests(updatedQuests);
  };

  const updateQuestProgress = async (questId: string, progress: number) => {
    const updatedQuests = quests.map(quest => 
      quest.id === questId 
        ? { 
            ...quest, 
            progress: Math.min(progress, quest.maxProgress),
            completed: progress >= quest.maxProgress
          }
        : quest
    );
    await saveQuests(updatedQuests);
  };

  const refreshQuests = async () => {
    // In a real app, this would fetch from an API
    // For now, we'll just regenerate daily quests if they've expired
    const now = new Date();
    const updatedQuests = quests.filter(quest => {
      if (quest.type === 'daily' && quest.expiresAt && quest.expiresAt < now) {
        return false; // Remove expired daily quests
      }
      return true;
    });

    // Add new daily quests if needed
    const hasActiveDailyQuests = updatedQuests.some(quest => quest.type === 'daily');
    if (!hasActiveDailyQuests) {
      const newDailyQuests = generateDailyQuests();
      updatedQuests.push(...newDailyQuests);
    }

    await saveQuests(updatedQuests);
  };

  return (
    <QuestContext.Provider value={{ 
      quests, 
      loading, 
      completeQuest, 
      updateQuestProgress, 
      refreshQuests 
    }}>
      {children}
    </QuestContext.Provider>
  );
};

export const useQuests = () => {
  const context = useContext(QuestContext);
  if (context === undefined) {
    throw new Error('useQuests must be used within a QuestProvider');
  }
  return context;
};