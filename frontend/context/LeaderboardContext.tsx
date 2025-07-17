import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LeaderboardUser {
  id: string;
  username: string;
  class: string;
  level: number;
  xp: number;
  totalXP: number; // Total XP earned across all levels
  gold: number;
  gems: number;
  postsCount: number;
  questsCompleted: number;
  rank: number;
  classRank: number;
}

interface LeaderboardContextType {
  users: LeaderboardUser[];
  loading: boolean;
  updateUserStats: (userId: string, stats: Partial<LeaderboardUser>) => Promise<void>;
  getUsersByClass: (className: string) => LeaderboardUser[];
  getTopUsers: (limit?: number) => LeaderboardUser[];
  getTopUsersByClass: (className: string, limit?: number) => LeaderboardUser[];
  getCurrentUserRank: (userId: string) => { overall: number; class: number } | null;
  refreshLeaderboard: () => Promise<void>;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

const LEADERBOARD_STORAGE_KEY = '@questagram_leaderboard';

// Generate sample leaderboard data for demo
const generateSampleUsers = (): LeaderboardUser[] => [
  {
    id: 'user1',
    username: 'DragonSlayer',
    class: 'warrior',
    level: 15,
    xp: 450,
    totalXP: 1950, // (14 * 100) + 450
    gold: 2500,
    gems: 45,
    postsCount: 23,
    questsCompleted: 18,
    rank: 1,
    classRank: 1
  },
  {
    id: 'user2',
    username: 'ArcaneWisdom',
    class: 'mage',
    level: 12,
    xp: 780,
    totalXP: 1880, // (11 * 100) + 780
    gold: 1800,
    gems: 52,
    postsCount: 31,
    questsCompleted: 15,
    rank: 2,
    classRank: 1
  },
  {
    id: 'user3',
    username: 'ShadowTrickster',
    class: 'rogue',
    level: 13,
    xp: 120,
    totalXP: 1420, // (12 * 100) + 120
    gold: 2100,
    gems: 38,
    postsCount: 45,
    questsCompleted: 12,
    rank: 3,
    classRank: 1
  },
  {
    id: 'user4',
    username: 'HolyHealer',
    class: 'cleric',
    level: 11,
    xp: 650,
    totalXP: 1650, // (10 * 100) + 650
    gold: 1200,
    gems: 41,
    postsCount: 19,
    questsCompleted: 22,
    rank: 4,
    classRank: 1
  },
  {
    id: 'user5',
    username: 'IronFist',
    class: 'warrior',
    level: 10,
    xp: 890,
    totalXP: 1390, // (9 * 100) + 890
    gold: 1900,
    gems: 28,
    postsCount: 17,
    questsCompleted: 14,
    rank: 5,
    classRank: 2
  },
  {
    id: 'user6',
    username: 'MysticScholar',
    class: 'mage',
    level: 9,
    xp: 340,
    totalXP: 1140, // (8 * 100) + 340
    gold: 1400,
    gems: 35,
    postsCount: 28,
    questsCompleted: 11,
    rank: 6,
    classRank: 2
  },
  {
    id: 'user7',
    username: 'StealthMaster',
    class: 'rogue',
    level: 8,
    xp: 720,
    totalXP: 1020, // (7 * 100) + 720
    gold: 1600,
    gems: 22,
    postsCount: 38,
    questsCompleted: 9,
    rank: 7,
    classRank: 2
  },
  {
    id: 'user8',
    username: 'DivineBless',
    class: 'cleric',
    level: 8,
    xp: 450,
    totalXP: 1150, // (7 * 100) + 450
    gold: 1100,
    gems: 33,
    postsCount: 15,
    questsCompleted: 16,
    rank: 8,
    classRank: 2
  },
  {
    id: 'current-user',
    username: 'You',
    class: 'warrior',
    level: 1,
    xp: 0,
    totalXP: 100,
    gold: 100,
    gems: 10,
    postsCount: 0,
    questsCompleted: 0,
    rank: 9,
    classRank: 3
  }
];

export const LeaderboardProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const storedLeaderboard = await AsyncStorage.getItem(LEADERBOARD_STORAGE_KEY);
      if (storedLeaderboard) {
        const leaderboardData = JSON.parse(storedLeaderboard);
        setUsers(leaderboardData);
      } else {
        // Generate initial leaderboard
        const initialUsers = generateSampleUsers();
        const rankedUsers = calculateRanks(initialUsers);
        setUsers(rankedUsers);
        await AsyncStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(rankedUsers));
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRanks = (userList: LeaderboardUser[]): LeaderboardUser[] => {
    // Sort by total XP (descending)
    const sortedUsers = [...userList].sort((a, b) => b.totalXP - a.totalXP);
    
    // Assign overall ranks
    const usersWithOverallRanks = sortedUsers.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    // Calculate class ranks
    const classes = ['warrior', 'mage', 'rogue', 'cleric'];
    const usersWithClassRanks = usersWithOverallRanks.map(user => {
      const classUsers = usersWithOverallRanks
        .filter(u => u.class === user.class)
        .sort((a, b) => b.totalXP - a.totalXP);
      
      const classRank = classUsers.findIndex(u => u.id === user.id) + 1;
      
      return {
        ...user,
        classRank
      };
    });

    return usersWithClassRanks;
  };

  const saveLeaderboard = async (updatedUsers: LeaderboardUser[]) => {
    try {
      const rankedUsers = calculateRanks(updatedUsers);
      await AsyncStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(rankedUsers));
      setUsers(rankedUsers);
    } catch (error) {
      console.error('Error saving leaderboard:', error);
    }
  };

  const updateUserStats = async (userId: string, stats: Partial<LeaderboardUser>) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const updatedUser = { ...user, ...stats };
        
        // Calculate total XP if level or xp changed
        if (stats.level !== undefined || stats.xp !== undefined) {
          const level = stats.level ?? user.level;
          const xp = stats.xp ?? user.xp;
          updatedUser.totalXP = ((level - 1) * 100) + xp;
        }
        
        return updatedUser;
      }
      return user;
    });

    await saveLeaderboard(updatedUsers);
  };

  const getUsersByClass = (className: string): LeaderboardUser[] => {
    return users
      .filter(user => user.class === className)
      .sort((a, b) => b.totalXP - a.totalXP);
  };

  const getTopUsers = (limit: number = 10): LeaderboardUser[] => {
    return users
      .sort((a, b) => b.totalXP - a.totalXP)
      .slice(0, limit);
  };

  const getTopUsersByClass = (className: string, limit: number = 5): LeaderboardUser[] => {
    return getUsersByClass(className).slice(0, limit);
  };

  const getCurrentUserRank = (userId: string): { overall: number; class: number } | null => {
    const user = users.find(u => u.id === userId);
    if (!user) return null;

    return {
      overall: user.rank,
      class: user.classRank
    };
  };

  const refreshLeaderboard = async () => {
    const rankedUsers = calculateRanks(users);
    await saveLeaderboard(rankedUsers);
  };

  return (
    <LeaderboardContext.Provider value={{
      users,
      loading,
      updateUserStats,
      getUsersByClass,
      getTopUsers,
      getTopUsersByClass,
      getCurrentUserRank,
      refreshLeaderboard
    }}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
};