// frontend/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { RootStackParamList } from './types/navigation';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ClassSelectionScreen from './screens/ClassSelectionScreen';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
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
          name="Login" 
          component={LoginScreen}
          options={{ title: 'Welcome to Questagram' }}
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen}
          options={{ title: 'Create Your Character' }}
        />
        <Stack.Screen 
          name="ClassSelection" 
          component={ClassSelectionScreen}
          options={{ title: 'Choose Your Path' }}
        />
        {/* Add your Home screen here when ready */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;