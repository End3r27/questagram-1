import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { usePosts, Post } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

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
            <View style={styles.userAvatar}>
              <Text style={styles.userEmoji}>
                {classEmojis[post.userClass] || '🎭'}
              </Text>
            </View>
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
          <View style={styles.xpBadge}>
            <Text style={styles.xpBadgeText}>+{post.xpEarned}</Text>
          </View>
        </View>

        {/* Post Content */}
        <Text style={styles.postContent}>{post.content}</Text>

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLike(post.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionEmoji}>❤️</Text>
            <Text style={styles.actionText}>{post.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleComment(post.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionEmoji}>💬</Text>
            <Text style={styles.actionText}>{post.comments.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            activeOpacity={0.7}
          >
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
                <Text style={styles.commentUser}>{comment.username}</Text>
                <Text style={styles.commentText}>{comment.content}</Text>
              </View>
            ))}
            {post.comments.length > 2 && (
              <TouchableOpacity>
                <Text style={styles.moreComments}>
                  View {post.comments.length - 2} more comments...
                </Text>
              </TouchableOpacity>
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
          activeOpacity={0.8}
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
          activeOpacity={0.8}
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
            activeOpacity={0.8}
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
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>📭</Text>
            <Text style={styles.emptyStateText}>
              No posts in this zone yet
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Be the first to share your adventure!
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => router.push('/create-post')}
            >
              <Text style={styles.emptyStateButtonText}>Create First Post</Text>
            </TouchableOpacity>
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
  createButton: {
    backgroundColor: '#00cc66',
    padding: 12,
    borderRadius: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 20,
  },
  zoneFilter: {
    maxHeight: 80,
    backgroundColor: '#1a1a1a',
  },
  zoneFilterContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  zoneFilterButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
    minHeight: 44,
  },
  selectedZoneFilter: {
    backgroundColor: '#0066cc',
    borderColor: '#0088ff',
  },
  zoneFilterEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  zoneFilterText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedZoneFilterText: {
    color: '#fff',
  },
  feed: {
    flex: 1,
  },
  feedContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  separator: {
    height: 12,
  },
  postCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    marginLeft: 4,
  },
  xpBadge: {
    backgroundColor: '#00cc66',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  postContent: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    minHeight: 44,
  },
  actionEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  actionText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '600',
  },
  commentsSection: {
    marginTop: 12,
    paddingTop: 12,
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
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  commentUser: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0066cc',
    marginRight: 6,
  },
  commentText: {
    fontSize: 12,
    color: '#ccc',
    flex: 1,
    lineHeight: 16,
  },
  moreComments: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
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
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyStateButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});