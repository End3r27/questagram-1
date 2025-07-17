import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Post {
  id: string;
  userId: string;
  username: string;
  userClass: string;
  content: string;
  imageUri?: string;
  zone: string;
  likes: number;
  comments: Comment[];
  createdAt: Date;
  xpEarned: number;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
}

export interface Zone {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requiredLevel: number;
  classBonus?: string[];
}

interface PostContextType {
  posts: Post[];
  zones: Zone[];
  loading: boolean;
  createPost: (content: string, zone: string, imageUri?: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  getPostsByZone: (zoneId: string) => Post[];
  getAvailableZones: (userLevel: number) => Zone[];
}

const PostContext = createContext<PostContextType | undefined>(undefined);

const POSTS_STORAGE_KEY = '@questagram_posts';

// Predefined zones based on README
const allZones: Zone[] = [
  {
    id: 'artisan_valley',
    name: 'Artisan\'s Valley',
    emoji: '🎨',
    description: 'Art, crafts, and creative content',
    requiredLevel: 1,
    classBonus: ['mage']
  },
  {
    id: 'arena_trends',
    name: 'Arena of Trends',
    emoji: '🔥',
    description: 'Trending challenges and viral content',
    requiredLevel: 1,
    classBonus: ['rogue']
  },
  {
    id: 'the_library',
    name: 'The Library',
    emoji: '📚',
    description: 'Educational and insightful content',
    requiredLevel: 1,
    classBonus: ['mage']
  },
  {
    id: 'training_grounds',
    name: 'Training Grounds',
    emoji: '⚔️',
    description: 'Fitness, sports, and physical activities',
    requiredLevel: 1,
    classBonus: ['warrior']
  },
  {
    id: 'sanctuary',
    name: 'The Sanctuary',
    emoji: '✨',
    description: 'Support, kindness, and community',
    requiredLevel: 1,
    classBonus: ['cleric']
  },
  {
    id: 'mystic_realm',
    name: 'Mystic Realm',
    emoji: '🌟',
    description: 'Advanced magical content',
    requiredLevel: 5,
    classBonus: ['mage']
  },
  {
    id: 'champions_hall',
    name: 'Champions Hall',
    emoji: '🏆',
    description: 'Elite achievements and competitions',
    requiredLevel: 10,
    classBonus: ['warrior', 'rogue']
  }
];

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const storedPosts = await AsyncStorage.getItem(POSTS_STORAGE_KEY);
      if (storedPosts) {
        const postData = JSON.parse(storedPosts).map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          comments: post.comments.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt)
          }))
        }));
        setPosts(postData);
      } else {
        // Generate some sample posts
        const samplePosts = generateSamplePosts();
        setPosts(samplePosts);
        await AsyncStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(samplePosts));
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePosts = async (updatedPosts: Post[]) => {
    try {
      await AsyncStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error saving posts:', error);
    }
  };

  const createPost = async (content: string, zone: string, imageUri?: string) => {
    // This would normally get user info from auth context
    const newPost: Post = {
      id: Date.now().toString(),
      userId: 'current-user',
      username: 'You',
      userClass: 'warrior', // Would come from auth context
      content,
      imageUri,
      zone,
      likes: 0,
      comments: [],
      createdAt: new Date(),
      xpEarned: 25 // Base XP for posting
    };

    const updatedPosts = [newPost, ...posts];
    await savePosts(updatedPosts);
  };

  const likePost = async (postId: string) => {
    const updatedPosts = posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    );
    await savePosts(updatedPosts);
  };

  const addComment = async (postId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: 'current-user',
      username: 'You',
      content,
      createdAt: new Date()
    };

    const updatedPosts = posts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    );
    await savePosts(updatedPosts);
  };

  const getPostsByZone = (zoneId: string): Post[] => {
    return posts.filter(post => post.zone === zoneId);
  };

  const getAvailableZones = (userLevel: number): Zone[] => {
    return allZones.filter(zone => zone.requiredLevel <= userLevel);
  };

  return (
    <PostContext.Provider value={{
      posts,
      zones: allZones,
      loading,
      createPost,
      likePost,
      addComment,
      getPostsByZone,
      getAvailableZones
    }}>
      {children}
    </PostContext.Provider>
  );
};

// Generate sample posts for demo
const generateSamplePosts = (): Post[] => [
  {
    id: '1',
    userId: 'user1',
    username: 'ArtMaster',
    userClass: 'mage',
    content: 'Just finished this digital painting! Magic flows through every pixel ✨',
    zone: 'artisan_valley',
    likes: 15,
    comments: [
      {
        id: 'c1',
        userId: 'user2',
        username: 'SupportiveCleric',
        content: 'Amazing work! Your talent is inspiring 🎨',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    xpEarned: 40
  },
  {
    id: '2',
    userId: 'user3',
    username: 'FitnessWarrior',
    userClass: 'warrior',
    content: 'Conquered my morning workout! 💪 Nothing beats the feeling of pushing your limits!',
    zone: 'training_grounds',
    likes: 23,
    comments: [],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    xpEarned: 35
  },
  {
    id: '3',
    userId: 'user4',
    username: 'TrendRogue',
    userClass: 'rogue',
    content: 'When you realize Monday is just Tuesday\'s evil twin 😈 #MondayMood',
    zone: 'arena_trends',
    likes: 42,
    comments: [
      {
        id: 'c2',
        userId: 'user5',
        username: 'WiseCleric',
        content: 'Haha, this made my day! 😂',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    xpEarned: 50
  }
];

export const usePosts = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};