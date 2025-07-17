import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { usePosts } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { createPost, getAvailableZones } = usePosts();
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const availableZones = getAvailableZones(user?.level || 1);

  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert('Empty Post', 'Please write something before posting!');
      return;
    }

    if (!selectedZone) {
      Alert.alert('No Zone Selected', 'Please select a zone for your post!');
      return;
    }

    setLoading(true);

    try {
      await createPost(content, selectedZone);
      
      // Award XP to user
      if (user) {
        let xpGain = 25; // Base XP for posting
        
        // Zone bonus for matching class
        const zone = availableZones.find(z => z.id === selectedZone);
        if (zone?.classBonus && user.class && zone.classBonus.includes(user.class)) {
          xpGain = Math.floor(xpGain * 1.5); // 50% bonus
        }

        const newXP = (user.xp || 0) + xpGain;
        const xpForNextLevel = user.level! * 100;
        
        if (newXP >= xpForNextLevel) {
          // Level up!
          await updateUser({
            level: (user.level || 1) + 1,
            xp: newXP - xpForNextLevel,
            gold: (user.gold || 0) + 50,
            gems: (user.gems || 0) + 5
          });
          
          Alert.alert(
            '🎉 Post Created & Level Up!', 
            `Your post earned ${xpGain} XP and you leveled up to ${(user.level || 1) + 1}!`,
            [{ text: 'Awesome!', onPress: () => router.back() }]
          );
        } else {
          await updateUser({ xp: newXP });
          
          Alert.alert(
            '📸 Post Created!', 
            `Your post earned ${xpGain} XP! Keep sharing your adventure!`,
            [{ text: 'Great!', onPress: () => router.back() }]
          );
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getZoneColor = (zoneId: string) => {
    const zoneColors: { [key: string]: string } = {
      artisan_valley: '#9b59b6',
      arena_trends: '#e74c3c',
      the_library: '#3498db',
      training_grounds: '#e67e22',
      sanctuary: '#f1c40f',
      mystic_realm: '#8e44ad',
      champions_hall: '#d4af37'
    };
    return zoneColors[zoneId] || '#666';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>📸 Create Your Post</Text>
        <Text style={styles.subtitle}>Share your adventure with the realm!</Text>
      </View>

      {/* Content Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>What's on your mind, adventurer?</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Share your thoughts, achievements, or discoveries..."
          placeholderTextColor="#999"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          editable={!loading}
        />
        <Text style={styles.characterCount}>{content.length}/500</Text>
      </View>

      {/* Zone Selection */}
      <View style={styles.zoneContainer}>
        <Text style={styles.label}>Choose Your Zone</Text>
        <Text style={styles.zoneSubtitle}>Select where your post belongs in the realm</Text>
        
        {availableZones.map((zone) => (
          <TouchableOpacity
            key={zone.id}
            style={[
              styles.zoneCard,
              selectedZone === zone.id && [
                styles.selectedZone,
                { borderColor: getZoneColor(zone.id) }
              ]
            ]}
            onPress={() => setSelectedZone(zone.id)}
            disabled={loading}
          >
            <View style={styles.zoneHeader}>
              <Text style={styles.zoneEmoji}>{zone.emoji}</Text>
              <View style={styles.zoneInfo}>
                <Text style={[
                  styles.zoneName,
                  selectedZone === zone.id && { color: getZoneColor(zone.id) }
                ]}>
                  {zone.name}
                </Text>
                <Text style={styles.zoneDescription}>{zone.description}</Text>
              </View>
              {zone.classBonus && user?.class && zone.classBonus.includes(user.class) && (
                <Text style={styles.bonusIndicator}>⭐</Text>
              )}
            </View>
            
            {zone.classBonus && user?.class && zone.classBonus.includes(user.class) && (
              <Text style={styles.bonusText}>✨ Class Bonus: +50% XP!</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* XP Preview */}
      {selectedZone && (
        <View style={styles.xpPreview}>
          <Text style={styles.xpPreviewTitle}>📊 Expected Rewards</Text>
          <View style={styles.xpPreviewContent}>
            <Text style={styles.xpPreviewText}>
              Base XP: 25 {(() => {
                const zone = availableZones.find(z => z.id === selectedZone);
                if (zone?.classBonus && user?.class && zone.classBonus.includes(user.class)) {
                  return '→ 37 XP (Class Bonus!)';
                }
                return 'XP';
              })()}
            </Text>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.createButton,
            (!content.trim() || !selectedZone || loading) && styles.disabledButton
          ]}
          onPress={handleCreatePost}
          disabled={!content.trim() || !selectedZone || loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? '📤 Posting...' : '🚀 Share Adventure'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
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
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    minHeight: 120,
    borderWidth: 2,
    borderColor: '#444',
  },
  characterCount: {
    textAlign: 'right',
    color: '#999',
    fontSize: 12,
    marginTop: 5,
  },
  zoneContainer: {
    marginBottom: 30,
  },
  zoneSubtitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 15,
  },
  zoneCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#444',
  },
  selectedZone: {
    backgroundColor: '#333',
    borderWidth: 3,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoneEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  zoneDescription: {
    fontSize: 12,
    color: '#ccc',
  },
  bonusIndicator: {
    fontSize: 20,
  },
  bonusText: {
    fontSize: 12,
    color: '#ffff44',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  xpPreview: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 15,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#0066cc',
  },
  xpPreviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  xpPreviewContent: {
    alignItems: 'center',
  },
  xpPreviewText: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#00cc66',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#444',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#666',
  },
  cancelButtonText: {
    color: '#ccc',
    fontSize: 16,
  },
});