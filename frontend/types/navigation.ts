// frontend/types/navigation.ts
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

// Define the parameter list for your stack navigator
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ClassSelection: { userClass?: string };
  Home: { userClass?: string };
};

// Navigation prop types for each screen
export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
export type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;
export type ClassSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ClassSelection'>;

// Route prop types for each screen
export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;
export type SignupScreenRouteProp = RouteProp<RootStackParamList, 'Signup'>;
export type ClassSelectionScreenRouteProp = RouteProp<RootStackParamList, 'ClassSelection'>;

// Screen props that combine navigation and route
export type LoginScreenProps = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

export type SignupScreenProps = {
  navigation: SignupScreenNavigationProp;
  route: SignupScreenRouteProp;
};

export type ClassSelectionScreenProps = {
  navigation: ClassSelectionScreenNavigationProp;
  route: ClassSelectionScreenRouteProp;
};

// Declare global types for React Navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}