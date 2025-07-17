import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { usePosts } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
            maxLength={500}
          />
          <View style={styles.characterCountContainer}>
            <Text style={[
              styles.characterCount,
              content.length > 450 && styles.characterCountWarning,
              content.length >= 500 && styles.characterCountError
            ]}>
              {content.length}/500
            </Text>
          </View>
        </View>

        {/* Zone Selection */}
        <View style={styles.zoneContainer}>
          <Text style={styles.label}>Choose Your Zone</Text>
          <Text style={styles.zoneSubtitle}>Select where your post belongs in the realm</Text>
          
          <View style={styles.zoneGrid}>
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
                activeOpacity={0.8}
              >
                <Text style={styles.zoneEmoji}>{zone.emoji}</Text>
                <Text style={[
                  styles.zoneName,
                  selectedZone === zone.id && { color: getZoneColor(zone.id) }
                ]}>
                  {zone.name}
                </Text>
                <Text style={styles.zoneDescription}>{zone.description}</Text>
                
                {zone.classBonus && user?.class && zone.classBonus.includes(user.class) && (
                  <View style={styles.bonusIndicator}>
                    <Text style={styles.bonusText}>⭐ Class Bonus</Text>
                  </View>
                )}
                
                {selectedZone === zone.id && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.selectedText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
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
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.createButton,
            (!content.trim() || !selectedZone || loading) && styles.disabledButton
          ]}
          onPress={handleCreatePost}
          disabled={!content.trim() || !selectedZone || loading}
          activeOpacity={0.8}
        >
          <Text style={styles.createButtonText}>
            {loading ? '📤 Posting...' : '🚀 Share'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100, // Space for bottom bar
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    minHeight: 120,
    borderWidth: 2,
    borderColor: '#444',
    textAlignVertical: 'top',
  },
  characterCountContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  characterCount: {
    color: '#999',
    fontSize: 12,
  },
  characterCountWarning: {
    color: '#ffaa00',
  },
  characterCountError: {
    color: '#ff4444',
  },
  zoneContainer: {
    marginBottom: 24,
  },
  zoneSubtitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 16,
  },
  zoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  zoneCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#444',
    width: (screenWidth - 56) / 2,
    minHeight: 120,
    position: 'relative',
    alignItems: 'center',
  },
  selectedZone: {
    backgroundColor: '#333',
    borderWidth: 3,
  },
  zoneEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  zoneName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  zoneDescription: {
    fontSize: 11,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 14,
  },
  bonusIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffff44',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  bonusText: {
    fontSize: 8,
    color: '#000',
    fontWeight: 'bold',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#00cc66',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  xpPreview: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#0066cc',
  },
  xpPreviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
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
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#666',
    marginRight: 12,
    minHeight: 56,
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    flex: 2,
    backgroundColor: '#00cc66',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#444',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});