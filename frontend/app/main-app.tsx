import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

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
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const handleGainXP = async () => {
    if (!user) return;
    
    const xpGain = 25;
    const newXP = (user.xp || 0) + xpGain;
    const xpForNextLevel = user.level! * 100; // Simple leveling formula
    
    if (newXP >= xpForNextLevel) {
      // Level up!
      await updateUser({
        level: (user.level || 1) + 1,
        xp: newXP - xpForNextLevel,
        gold: (user.gold || 0) + 50,
        gems: (user.gems || 0) + 5
      });
    } else {
      await updateUser({ xp: newXP });
    }
  };

  const getXPProgress = () => {
    if (!user) return 0;
    const xpForNextLevel = user.level! * 100;
    return ((user.xp || 0) / xpForNextLevel) * 100;
  };

  const classEmoji = user?.class ? classEmojis[user.class] : '🎭';
  const classColor = user?.class ? classColors[user.class] : '#666';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🏰 Questagram 🏰</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪</Text>
        </TouchableOpacity>
      </View>

      {/* Character Card */}
      <View style={[styles.characterCard, { borderColor: classColor }]}>
        <View style={styles.characterHeader}>
          <Text style={styles.characterEmoji}>{classEmoji}</Text>
          <View style={styles.characterInfo}>
            <Text style={styles.username}>{user?.username}</Text>
            <Text style={[styles.className, { color: classColor }]}>
              Level {user?.level} {user?.class ? user.class.charAt(0).toUpperCase() + user.class.slice(1) : 'Adventurer'}
            </Text>
          </View>
        </View>

        {/* XP Bar */}
        <View style={styles.xpContainer}>
          <Text style={styles.xpLabel}>XP: {user?.xp || 0} / {(user?.level || 1) * 100}</Text>
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

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/create-post')}>
          <Text style={styles.actionEmoji}>📸</Text>
          <Text style={styles.actionText}>Create Post (+25 XP)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/quests')}>
          <Text style={styles.actionEmoji}>📜</Text>
          <Text style={styles.actionText}>Daily Quests</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/feed')}>
          <Text style={styles.actionEmoji}>🗺️</Text>
          <Text style={styles.actionText}>Explore Feed</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionEmoji}>👥</Text>
          <Text style={styles.actionText}>Find Guild</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>📰 Recent Activity</Text>
        <View style={styles.activityItem}>
          <Text style={styles.activityText}>🎉 Welcome to Questagram!</Text>
          <Text style={styles.activityTime}>Just now</Text>
        </View>
        <View style={styles.activityItem}>
          <Text style={styles.activityText}>🎭 Class selected: {user?.class}</Text>
          <Text style={styles.activityTime}>Today</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
  },
  characterCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
  },
  characterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  characterEmoji: {
    fontSize: 50,
    marginRight: 15,
  },
  characterInfo: {
    flex: 1,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
  },
  xpContainer: {
    marginBottom: 15,
  },
  xpLabel: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
  xpBar: {
    height: 8,
    backgroundColor: '#444',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: 4,
  },
  currencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyEmoji: {
    fontSize: 20,
    marginRight: 5,
  },
  currencyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 20,
    marginRight: 15,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
  },
  activityContainer: {
    marginBottom: 20,
  },
  activityItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  activityTime: {
    color: '#ccc',
    fontSize: 12,
  },
});