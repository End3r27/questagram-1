import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

interface ClassInfo {
  id: string;
  name: string;
  emoji: string;
  description: string;
  focus: string;
  bonuses: string[];
  color: string;
}

const classes: ClassInfo[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    emoji: '⚔️',
    description: 'Masters of physical prowess and determination',
    focus: 'Sports, fitness, action content',
    bonuses: [
      '+15% XP from fitness posts',
      'Access to Arena of Champions',
      'Strength-based quest bonuses',
      'Warrior-exclusive gear'
    ],
    color: '#ff4444'
  },
  {
    id: 'mage',
    name: 'Mage',
    emoji: '🔮',
    description: 'Wielders of knowledge and creative magic',
    focus: 'Art, education, design, coding',
    bonuses: [
      '+15% XP from educational posts',
      'Access to Artisan\'s Valley',
      'Wisdom-based quest bonuses',
      'Magical cosmetic effects'
    ],
    color: '#4444ff'
  },
  {
    id: 'rogue',
    name: 'Rogue',
    emoji: '🗡️',
    description: 'Cunning trendsetters and meme masters',
    focus: 'Memes, trends, viral content',
    bonuses: [
      '+15% XP from trending posts',
      'Access to Arena of Trends',
      'Charisma-based quest bonuses',
      'Stealth profile effects'
    ],
    color: '#44ff44'
  },
  {
    id: 'cleric',
    name: 'Cleric',
    emoji: '✨',
    description: 'Healers and supporters of the community',
    focus: 'Support, comments, kind interactions',
    bonuses: [
      '+15% XP from helpful comments',
      'Access to The Sanctuary',
      'Healing-based quest bonuses',
      'Supportive aura effects'
    ],
    color: '#ffff44'
  }
];

export default function ClassSelection() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const { login, user } = useAuth();

  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId);
  };

  const handleConfirmSelection = async () => {
    if (!selectedClass) {
      Alert.alert('No Class Selected', 'Please choose a class before continuing.');
      return;
    }

    const selectedClassInfo = classes.find(c => c.id === selectedClass);
    
    Alert.alert(
      'Confirm Your Path',
      `Are you ready to begin your journey as a ${selectedClassInfo?.name}? This choice will shape your adventure in Questagram!`,
      [
        {
          text: 'Choose Different Class',
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: async () => {
            // Update user with selected class
            if (user) {
              await login({
                ...user,
                hasSelectedClass: true,
                class: selectedClass
              });
            }
            
            Alert.alert(
              'Welcome to Your Adventure!',
              `You are now a ${selectedClassInfo?.name}! Your journey in Questagram begins now.`
            );
          }
        }
      ]
    );
  };

  const selectedClassInfo = selectedClass ? classes.find(c => c.id === selectedClass) : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>🎭 Choose Your Path 🎭</Text>
        <Text style={styles.subtitle}>
          Your class determines your journey through Questagram
        </Text>
      </View>

      <View style={styles.classGrid}>
        {classes.map((classInfo) => (
          <TouchableOpacity
            key={classInfo.id}
            style={[
              styles.classCard,
              selectedClass === classInfo.id && [
                styles.selectedClassCard,
                { borderColor: classInfo.color }
              ]
            ]}
            onPress={() => handleClassSelect(classInfo.id)}
          >
            <Text style={styles.classEmoji}>{classInfo.emoji}</Text>
            <Text style={[
              styles.className,
              selectedClass === classInfo.id && { color: classInfo.color }
            ]}>
              {classInfo.name}
            </Text>
            <Text style={styles.classFocus}>{classInfo.focus}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedClassInfo && (
        <View style={[styles.detailCard, { borderColor: selectedClassInfo.color }]}>
          <Text style={[styles.detailTitle, { color: selectedClassInfo.color }]}>
            {selectedClassInfo.emoji} {selectedClassInfo.name}
          </Text>
          <Text style={styles.detailDescription}>
            {selectedClassInfo.description}
          </Text>
          
          <Text style={styles.bonusesTitle}>Class Bonuses:</Text>
          {selectedClassInfo.bonuses.map((bonus, index) => (
            <Text key={index} style={styles.bonusItem}>
              • {bonus}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.confirmButton,
          selectedClass && { backgroundColor: selectedClassInfo?.color || '#0066cc' },
          !selectedClass && styles.disabledButton
        ]}
        onPress={handleConfirmSelection}
        disabled={!selectedClass}
      >
        <Text style={styles.confirmButtonText}>
          {selectedClass ? `Begin as ${selectedClassInfo?.name}` : 'Select a Class'}
        </Text>
      </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  classGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  classCard: {
    width: '48%',
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  selectedClassCard: {
    backgroundColor: '#333',
    borderWidth: 3,
  },
  classEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  classFocus: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
  },
  detailCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  detailDescription: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  bonusesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  bonusItem: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
    paddingLeft: 10,
  },
  confirmButton: {
    backgroundColor: '#666',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#444',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});