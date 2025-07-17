import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useQuests, Quest } from '../context/QuestContext';
import { useAuth } from '../context/AuthContext';

const difficultyColors = {
  easy: '#44ff44',
  medium: '#ffff44',
  hard: '#ff4444'
};

const typeEmojis = {
  daily: '📅',
  weekly: '📆',
  special: '⭐'
};

export default function QuestsPage() {
  const { quests, loading, completeQuest } = useQuests();
  const { user, updateUser } = useAuth();

  const handleCompleteQuest = async (quest: Quest) => {
    if (quest.completed) return;

    Alert.alert(
      'Complete Quest',
      `Complete "${quest.title}"?\n\nRewards:\n• ${quest.xpReward} XP\n• ${quest.goldReward} Gold${quest.gemReward ? `\n• ${quest.gemReward} Gems` : ''}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            await completeQuest(quest.id);
            
            // Award rewards to user
            if (user) {
              let xpReward = quest.xpReward;
              let goldReward = quest.goldReward;
              let gemReward = quest.gemReward || 0;

              // Class bonus
              if (quest.classBonus && user.class && quest.classBonus.includes(user.class)) {
                xpReward = Math.floor(xpReward * 1.5);
                goldReward = Math.floor(goldReward * 1.5);
              }

              const newXP = (user.xp || 0) + xpReward;
              const xpForNextLevel = user.level! * 100;
              
              if (newXP >= xpForNextLevel) {
                // Level up!
                await updateUser({
                  level: (user.level || 1) + 1,
                  xp: newXP - xpForNextLevel,
                  gold: (user.gold || 0) + goldReward + 50, // Bonus gold for leveling
                  gems: (user.gems || 0) + gemReward + 5 // Bonus gems for leveling
                });
                
                Alert.alert('🎉 Level Up!', `Congratulations! You reached level ${(user.level || 1) + 1}!`);
              } else {
                await updateUser({
                  xp: newXP,
                  gold: (user.gold || 0) + goldReward,
                  gems: (user.gems || 0) + gemReward
                });
              }
            }
          }
        }
      ]
    );
  };

  const renderQuest = (quest: Quest) => {
    const progressPercentage = (quest.progress / quest.maxProgress) * 100;
    const isClassBonus = quest.classBonus && user?.class && quest.classBonus.includes(user.class);

    return (
      <TouchableOpacity
        key={quest.id}
        style={[
          styles.questCard,
          quest.completed && styles.completedQuest,
          isClassBonus && styles.classBonusQuest
        ]}
        onPress={() => handleCompleteQuest(quest)}
        disabled={quest.completed}
      >
        <View style={styles.questHeader}>
          <View style={styles.questTitleRow}>
            <Text style={styles.questEmoji}>{typeEmojis[quest.type]}</Text>
            <Text style={styles.questTitle}>{quest.title}</Text>
            {isClassBonus && <Text style={styles.bonusIndicator}>⭐</Text>}
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: difficultyColors[quest.difficulty] }]}>
            <Text style={styles.difficultyText}>{quest.difficulty.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.questDescription}>{quest.description}</Text>

        <View style={styles.requirementsContainer}>
          {quest.requirements.map((req, index) => (
            <Text key={index} style={styles.requirement}>• {req}</Text>
          ))}
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Progress: {quest.progress}/{quest.maxProgress}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progressPercentage}%`,
                  backgroundColor: quest.completed ? '#44ff44' : '#0066cc'
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.rewardsContainer}>
          <Text style={styles.rewardsTitle}>Rewards:</Text>
          <View style={styles.rewardsRow}>
            <Text style={styles.reward}>🎯 {isClassBonus ? Math.floor(quest.xpReward * 1.5) : quest.xpReward} XP</Text>
            <Text style={styles.reward}>🪙 {isClassBonus ? Math.floor(quest.goldReward * 1.5) : quest.goldReward}</Text>
            {quest.gemReward && (
              <Text style={styles.reward}>💎 {quest.gemReward}</Text>
            )}
          </View>
          {isClassBonus && (
            <Text style={styles.classBonusText}>✨ Class Bonus: +50% rewards!</Text>
          )}
        </View>

        {quest.expiresAt && (
          <Text style={styles.expiryText}>
            Expires: {quest.expiresAt.toLocaleDateString()}
          </Text>
        )}

        {quest.completed && (
          <View style={styles.completedOverlay}>
            <Text style={styles.completedText}>✅ COMPLETED</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const dailyQuests = quests.filter(q => q.type === 'daily');
  const weeklyQuests = quests.filter(q => q.type === 'weekly');
  const specialQuests = quests.filter(q => q.type === 'special');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading quests...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>📜 Quest Board 📜</Text>
        <Text style={styles.subtitle}>Complete quests to earn XP, gold, and gems!</Text>
      </View>

      {dailyQuests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Daily Quests</Text>
          {dailyQuests.map(renderQuest)}
        </View>
      )}

      {weeklyQuests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📆 Weekly Quests</Text>
          {weeklyQuests.map(renderQuest)}
        </View>
      )}

      {specialQuests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Special Quests</Text>
          {specialQuests.map(renderQuest)}
        </View>
      )}
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
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  questCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#444',
    position: 'relative',
  },
  completedQuest: {
    opacity: 0.7,
    borderColor: '#44ff44',
  },
  classBonusQuest: {
    borderColor: '#ffff44',
    backgroundColor: '#2a2a1a',
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  questEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  questTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  bonusIndicator: {
    fontSize: 16,
    marginLeft: 5,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  questDescription: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 15,
  },
  requirementsContainer: {
    marginBottom: 15,
  },
  requirement: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 2,
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressText: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#444',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  rewardsContainer: {
    marginBottom: 10,
  },
  rewardsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  rewardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reward: {
    fontSize: 12,
    color: '#ccc',
    marginRight: 15,
    marginBottom: 2,
  },
  classBonusText: {
    fontSize: 12,
    color: '#ffff44',
    fontStyle: 'italic',
    marginTop: 5,
  },
  expiryText: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
  },
  completedOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#44ff44',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  completedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
});