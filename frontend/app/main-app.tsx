import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useLeaderboard } from '../context/LeaderboardContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const classEmojis: { [key: string]: string } = {
  warrior: '⚔️',
  mage: '🔮',
  rogue: '🗡️',
  cleric: '✨'
};

const classColors: { [key: string]: string } = {
  warrior: '#ff4444',
  mage: '#4444ff',
  rogue: '#44ff44',
  cleric: '#ffff44'
};

export default function MainApp() {
  const { user, logout, updateUser } = useAuth();
  const { updateUserStats, getCurrentUserRank } = useLeaderboard();
  const router = useRouter();

  // Sync user stats with leaderboard when user data changes
  useEffect(() => {
    if (user) {
      updateUserStats(user.id, {
        username: user.username,
        class: user.class || 'warrior',
        level: user.level || 1,
        xp: user.xp || 0,
        gold: user.gold || 100,
        gems: user.gems || 10,
        postsCount: 0,
        questsCompleted: 0
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
  };

  const getXPProgress = () => {
    if (!user) return 0;
    const xpForNextLevel = user.level! * 100;
    return ((user.xp || 0) / xpForNextLevel) * 100;
  };

  const classEmoji = user?.class ? classEmojis[user.class] : '🎭';
  const classColor = user?.class ? classColors[user.class] : '#666';
  const currentUserRank = user ? getCurrentUserRank(user.id) : null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🏰 Questagram</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Character Card */}
        <View style={[styles.characterCard, { borderColor: classColor }]}>
          <View style={styles.characterHeader}>
            <Text style={styles.characterEmoji}>{classEmoji}</Text>
            <View style={styles.characterInfo}>
              <Text style={styles.username}>{user?.username}</Text>
              <Text style={[styles.className, { color: classColor }]}>
                Level {user?.level} {user?.class ? user.class.charAt(0).toUpperCase() + user.class.slice(1) : 'Adventurer'}
              </Text>
              {currentUserRank && (
                <Text style={styles.rankText}>
                  Rank #{currentUserRank.overall} • Class #{currentUserRank.class}
                </Text>
              )}
            </View>
          </View>

          {/* XP Bar */}
          <View style={styles.xpContainer}>
            <View style={styles.xpLabelRow}>
              <Text style={styles.xpLabel}>XP: {user?.xp || 0} / {(user?.level || 1) * 100}</Text>
              <Text style={styles.xpPercentage}>{Math.round(getXPProgress())}%</Text>
            </View>
            <View style={styles.xpBar}>
              <View style={[styles.xpFill, { width: `${getXPProgress()}%`, backgroundColor: classColor }]} />
            </View>
          </View>

          {/* Currency */}
          <View style={styles.currencyContainer}>
            <View style={styles.currencyItem}>
              <Text style={styles.currencyEmoji}>🪙</Text>
              <Text style={styles.currencyText}>{user?.gold || 0}</Text>
            </View>
            <View style={styles.currencyItem}>
              <Text style={styles.currencyEmoji}>💎</Text>
              <Text style={styles.currencyText}>{user?.gems || 0}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={[styles.actionCard, styles.primaryAction]} 
              onPress={() => router.push('/create-post')}
            >
              <Text style={styles.actionEmoji}>📸</Text>
              <Text style={styles.actionTitle}>Create Post</Text>
              <Text style={styles.actionSubtitle}>+25 XP</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard} 
              onPress={() => router.push('/quests')}
            >
              <Text style={styles.actionEmoji}>📜</Text>
              <Text style={styles.actionTitle}>Quests</Text>
              <Text style={styles.actionSubtitle}>Daily rewards</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard} 
              onPress={() => router.push('/feed')}
            >
              <Text style={styles.actionEmoji}>🗺️</Text>
              <Text style={styles.actionTitle}>Feed</Text>
              <Text style={styles.actionSubtitle}>Explore zones</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard} 
              onPress={() => router.push('/leaderboard')}
            >
              <Text style={styles.actionEmoji}>🏆</Text>
              <Text style={styles.actionTitle}>Leaderboard</Text>
              <Text style={styles.actionSubtitle}>Rankings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>📰 Recent Activity</Text>
          <View style={styles.activityItem}>
            <Text style={styles.activityEmoji}>🎉</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Welcome to Questagram!</Text>
              <Text style={styles.activityTime}>Just now</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityEmoji}>🎭</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Class selected: {user?.class}</Text>
              <Text style={styles.activityTime}>Today</Text>
            </View>
          </View>
          {currentUserRank && (
            <View style={styles.activityItem}>
              <Text style={styles.activityEmoji}>🏆</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Current rank: #{currentUserRank.overall}</Text>
                <Text style={styles.activityTime}>Now</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 20,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  characterCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  characterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  characterEmoji: {
    fontSize: 60,
    marginRight: 16,
  },
  characterInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  rankText: {
    fontSize: 12,
    color: '#0066cc',
    fontWeight: '600',
  },
  xpContainer: {
    marginBottom: 20,
  },
  xpLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpLabel: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '500',
  },
  xpPercentage: {
    color: '#0066cc',
    fontSize: 12,
    fontWeight: 'bold',
  },
  xpBar: {
    height: 12,
    backgroundColor: '#444',
    borderRadius: 6,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: 6,
  },
  currencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  currencyEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  currencyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    width: (screenWidth - 48) / 2 - 8,
    marginBottom: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  primaryAction: {
    backgroundColor: '#0066cc',
    borderColor: '#0088ff',
  },
  actionEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
  activityContainer: {
    marginBottom: 20,
  },
  activityItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 2,
  },
  activityTime: {
    color: '#999',
    fontSize: 12,
  },
});