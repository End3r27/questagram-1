import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native';
import { useLeaderboard, LeaderboardUser } from '../context/LeaderboardContext';
import { useAuth } from '../context/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

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

const classNames: { [key: string]: string } = {
  warrior: 'Warrior',
  mage: 'Mage',
  rogue: 'Rogue',
  cleric: 'Cleric'
};

export default function Leaderboard() {
  const [selectedTab, setSelectedTab] = useState<'overall' | 'warrior' | 'mage' | 'rogue' | 'cleric'>('overall');
  const { users, loading, getTopUsers, getTopUsersByClass, getCurrentUserRank } = useLeaderboard();
  const { user } = useAuth();

  const currentUserRank = user ? getCurrentUserRank(user.id) : null;

  const getDisplayUsers = (): LeaderboardUser[] => {
    if (selectedTab === 'overall') {
      return getTopUsers(20);
    } else {
      return getTopUsersByClass(selectedTab, 20);
    }
  };

  const getRankMedal = (rank: number): string => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const renderUserItem = ({ item: leaderboardUser, index }: { item: LeaderboardUser; index: number }) => {
    const isCurrentUser = user?.id === leaderboardUser.id;
    const rank = selectedTab === 'overall' ? leaderboardUser.rank : leaderboardUser.classRank;
    const classColor = classColors[leaderboardUser.class];

    return (
      <View style={[
        styles.userItem,
        isCurrentUser && styles.currentUserItem,
        rank <= 3 && styles.topThreeItem
      ]}>
        <View style={styles.rankContainer}>
          <Text style={[
            styles.rankText,
            rank <= 3 && styles.medalText
          ]}>
            {getRankMedal(rank)}
          </Text>
        </View>

        <View style={styles.userAvatar}>
          <Text style={styles.userEmoji}>
            {classEmojis[leaderboardUser.class]}
          </Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={[
            styles.username,
            isCurrentUser && styles.currentUsername
          ]}>
            {leaderboardUser.username}
            {isCurrentUser && ' (You)'}
          </Text>
          <Text style={[styles.userClass, { color: classColor }]}>
            Level {leaderboardUser.level} {classNames[leaderboardUser.class]}
          </Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{leaderboardUser.totalXP.toLocaleString()}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{leaderboardUser.postsCount}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{leaderboardUser.questsCompleted}</Text>
              <Text style={styles.statLabel}>Quests</Text>
            </View>
          </View>
        </View>

        <View style={styles.currencyContainer}>
          <View style={styles.currencyItem}>
            <Text style={styles.currencyEmoji}>🪙</Text>
            <Text style={styles.currencyText}>{leaderboardUser.gold}</Text>
          </View>
          <View style={styles.currencyItem}>
            <Text style={styles.currencyEmoji}>💎</Text>
            <Text style={styles.currencyText}>{leaderboardUser.gems}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Leaderboard</Text>
        <Text style={styles.subtitle}>Compete with fellow adventurers!</Text>
      </View>

      {/* Current User Rank */}
      {currentUserRank && (
        <View style={styles.currentRankCard}>
          <Text style={styles.currentRankTitle}>Your Ranking</Text>
          <View style={styles.currentRankStats}>
            <View style={styles.currentRankItem}>
              <Text style={styles.currentRankValue}>#{currentUserRank.overall}</Text>
              <Text style={styles.currentRankLabel}>Overall</Text>
            </View>
            <View style={styles.currentRankDivider} />
            <View style={styles.currentRankItem}>
              <Text style={styles.currentRankValue}>#{currentUserRank.class}</Text>
              <Text style={styles.currentRankLabel}>Class Rank</Text>
            </View>
          </View>
        </View>
      )}

      {/* Tab Navigation */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}
      >
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'overall' && styles.activeTab
          ]}
          onPress={() => setSelectedTab('overall')}
          activeOpacity={0.8}
        >
          <Text style={styles.tabEmoji}>🌍</Text>
          <Text style={[
            styles.tabText,
            selectedTab === 'overall' && styles.activeTabText
          ]}>
            Overall
          </Text>
        </TouchableOpacity>

        {Object.entries(classNames).map(([classKey, className]) => (
          <TouchableOpacity
            key={classKey}
            style={[
              styles.tab,
              selectedTab === classKey && [styles.activeTab, { borderColor: classColors[classKey] }]
            ]}
            onPress={() => setSelectedTab(classKey as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.tabEmoji}>{classEmojis[classKey]}</Text>
            <Text style={[
              styles.tabText,
              selectedTab === classKey && [styles.activeTabText, { color: classColors[classKey] }]
            ]}>
              {className}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Leaderboard List */}
      <FlatList
        data={getDisplayUsers()}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        style={styles.leaderboardList}
        contentContainerStyle={styles.leaderboardContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>📊</Text>
            <Text style={styles.emptyStateText}>No adventurers found</Text>
            <Text style={styles.emptyStateSubtext}>
              Be the first to climb the ranks!
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  currentRankCard: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#0066cc',
  },
  currentRankTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  currentRankStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentRankItem: {
    flex: 1,
    alignItems: 'center',
  },
  currentRankDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#444',
    marginHorizontal: 20,
  },
  currentRankValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 4,
  },
  currentRankLabel: {
    fontSize: 12,
    color: '#ccc',
  },
  tabContainer: {
    maxHeight: 80,
    backgroundColor: '#1a1a1a',
  },
  tabContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tab: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
    minWidth: 80,
    minHeight: 44,
  },
  activeTab: {
    backgroundColor: '#333',
    borderColor: '#0066cc',
  },
  tabEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  tabText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  leaderboardList: {
    flex: 1,
  },
  leaderboardContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  separator: {
    height: 8,
  },
  userItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#444',
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentUserItem: {
    borderColor: '#0066cc',
    backgroundColor: '#1a2a3a',
  },
  topThreeItem: {
    borderColor: '#ffd700',
    backgroundColor: '#2a2a1a',
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ccc',
  },
  medalText: {
    fontSize: 24,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userEmoji: {
    fontSize: 20,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  currentUsername: {
    color: '#0066cc',
  },
  userClass: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
  },
  currencyContainer: {
    alignItems: 'center',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  currencyEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  currencyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 22,
  },
});