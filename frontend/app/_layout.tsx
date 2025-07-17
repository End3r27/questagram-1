// frontend/app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { QuestProvider } from '../context/QuestContext';
import { PostProvider } from '../context/PostContext';
import { LeaderboardProvider } from '../context/LeaderboardContext';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

function AuthRedirector() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
    } else if (!user.hasSelectedClass) {
      router.replace('/class-selection');
    } else {
      router.replace('/main-app');
    }
  }, [user, loading]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <QuestProvider>
        <PostProvider>
          <LeaderboardProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <AuthRedirector />
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: '#1a1a1a',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}
              >
                <Stack.Screen 
                  name="index" 
                  options={{ 
                    title: 'Welcome to Questagram',
                    headerShown: false 
                  }} 
                />
                <Stack.Screen 
                  name="login" 
                  options={{ title: 'Enter the Realm' }} 
                />
                <Stack.Screen 
                  name="signup" 
                  options={{ title: 'Create Your Character' }} 
                />
                <Stack.Screen 
                  name="class-selection" 
                  options={{ title: 'Choose Your Path' }} 
                />
                <Stack.Screen 
                  name="main-app" 
                  options={{ headerShown: false }} 
                />
                <Stack.Screen 
                  name="quests" 
                  options={{ title: 'Quest Board' }} 
                />
                <Stack.Screen 
                  name="feed" 
                  options={{ title: 'Realm Feed' }} 
                />
                <Stack.Screen 
                  name="create-post" 
                  options={{ title: 'Create Post' }} 
                />
                <Stack.Screen 
                  name="leaderboard" 
                  options={{ title: 'Leaderboard' }} 
                />
                <Stack.Screen 
                  name="clear-storage" 
                  options={{ title: 'Debug Tools' }} 
                />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </LeaderboardProvider>
        </PostProvider>
      </QuestProvider>
    </AuthProvider>
  );
}