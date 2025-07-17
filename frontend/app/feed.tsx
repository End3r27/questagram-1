import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { usePosts, Post } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';

const classEmojis: { [key: string]: string } = {
  warrior: '⚔️',
  mage: '🔮',
  rogue: '🗡️',
  cleric: '✨'
};

export default function Feed() {
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const { posts, zones, likePost, addComment, getPostsByZone, getAvailableZones } = usePosts();
  const { user } = useAuth();
  const router = useRouter();

  const availableZones = getAvailableZones(user?.level || 1);
  const displayPosts = selectedZone === 'all' ? posts : getPostsByZone(selectedZone);

  const handleLike = async (postId: string) => {
    await likePost(postId);
  };

  const handleComment = async (postId: string) => {
    // For now, just add a sample comment
    await addComment(postId, 'Great post! 👍');
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const renderPost = ({ item: post }: { item: Post }) => {
    const zone = zones.find(z => z.id === post.zone);
    
    return (
      <View style={styles.postCard}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.userEmoji}>
              {classEmojis[post.userClass] || '🎭'}
            </Text>
            <View style={styles.userDetails}>
              <Text style={styles.username}>{post.username}</Text>
              <View style={styles.postMeta}>
                <Text style={styles.zoneTag}>
                  {zone?.emoji} {zone?.name}
                </Text>
                <Text style={styles.timeAgo}>
                  • {formatTimeAgo(post.createdAt)}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.xpBadge}>+{post.xpEarned} XP</Text>
        </View>

        {/* Post Content */}
        <Text style={styles.postContent}>{post.content}</Text>

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLike(post.id)}
          >
            <Text style={styles.actionEmoji}>❤️</Text>
            <Text style={styles.actionText}>{post.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleComment(post.id)}
          >
            <Text style={styles.actionEmoji}>💬</Text>
            <Text style={styles.actionText}>{post.comments.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionEmoji}>🔄</Text>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Comments Preview */}
        {post.comments.length > 0 && (
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Comments:</Text>
            {post.comments.slice(0, 2).map((comment) => (
              <View key={comment.id} style={styles.comment}>
                <Text style={styles.commentUser}>{comment.username}:</Text>
                <Text style={styles.commentText}>{comment.content}</Text>
              </View>
            ))}
            {post.comments.length > 2 && (
              <Text style={styles.moreComments}>
                View {post.comments.length - 2} more comments...
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🗺️ Realm Feed</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => router.push('/create-post')}
        >
          <Text style={styles.createButtonText}>📸</Text>
        </TouchableOpacity>
      </View>

      {/* Zone Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.zoneFilter}
        contentContainerStyle={styles.zoneFilterContent}
      >
        <TouchableOpacity
          style={[
            styles.zoneFilterButton,
            selectedZone === 'all' && styles.selectedZoneFilter
          ]}
          onPress={() => setSelectedZone('all')}
        >
          <Text style={styles.zoneFilterEmoji}>🌍</Text>
          <Text style={[
            styles.zoneFilterText,
            selectedZone === 'all' && styles.selectedZoneFilterText
          ]}>
            All Zones
          </Text>
        </TouchableOpacity>

        {availableZones.map((zone) => (
          <TouchableOpacity
            key={zone.id}
            style={[
              styles.zoneFilterButton,
              selectedZone === zone.id && styles.selectedZoneFilter
            ]}
            onPress={() => setSelectedZone(zone.id)}
          >
            <Text style={styles.zoneFilterEmoji}>{zone.emoji}</Text>
            <Text style={[
              styles.zoneFilterText,
              selectedZone === zone.id && styles.selectedZoneFilterText
            ]}>
              {zone.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Posts Feed */}
      <FlatList
        data={displayPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        style={styles.feed}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>📭</Text>
            <Text style={styles.emptyStateText}>
              No posts in this zone yet
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Be the first to share your adventure!
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#00cc66',
    padding: 12,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 20,
  },
  zoneFilter: {
    maxHeight: 80,
    marginBottom: 10,
  },
  zoneFilterContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  zoneFilterButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  selectedZoneFilter: {
    backgroundColor: '#0066cc',
    borderColor: '#0088ff',
  },
  zoneFilterEmoji: {
    fontSize: 16,
    marginRight: 5,
  },
  zoneFilterText: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '600',
  },
  selectedZoneFilterText: {
    color: '#fff',
  },
  feed: {
    flex: 1,
  },
  feedContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  postCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoneTag: {
    fontSize: 12,
    color: '#0066cc',
    fontWeight: '600',
  },
  timeAgo: {
    fontSize: 12,
    color: '#999',
    marginLeft: 5,
  },
  xpBadge: {
    backgroundColor: '#00cc66',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  postContent: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
    marginBottom: 15,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  actionEmoji: {
    fontSize: 16,
    marginRight: 5,
  },
  actionText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '600',
  },
  commentsSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  commentsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  commentUser: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0066cc',
    marginRight: 5,
  },
  commentText: {
    fontSize: 12,
    color: '#ccc',
    flex: 1,
  },
  moreComments: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
});