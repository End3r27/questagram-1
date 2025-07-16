// frontend/screens/ClassSelectionScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { ClassSelectionScreenProps } from '../types/navigation';

const classes = [
  { id: 'warrior', name: 'Warrior', description: 'Sports & Fitness enthusiast' },
  { id: 'mage', name: 'Mage', description: 'Art & Education creator' },
  { id: 'rogue', name: 'Rogue', description: 'Memes & Trends setter' },
  { id: 'cleric', name: 'Cleric', description: 'Support & Community builder' },
];

const ClassSelectionScreen: React.FC<ClassSelectionScreenProps> = ({ navigation, route }) => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  
  // Get the userClass from route params if it exists (from login)
  const userClassFromLogin = route.params?.userClass;

  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId);
    // Handle class selection logic here
    console.log(`Selected class: ${classId}`);
    
    // Navigate to the next screen or update user state
    // For now, navigate to Home with the selected class
    navigation.navigate('Home', { userClass: classId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {userClassFromLogin ? `Your Class: ${userClassFromLogin}` : 'Select Your Class'}
      </Text>
      
      {userClassFromLogin && (
        <Text style={styles.subtitle}>
          You can change your class or continue with your current selection
        </Text>
      )}
      
      {classes.map((classItem) => (
        <TouchableOpacity
          key={classItem.id}
          style={[
            styles.classButton,
            selectedClass === classItem.id && styles.selectedButton,
            userClassFromLogin === classItem.id && styles.currentClassButton,
          ]}
          onPress={() => handleClassSelect(classItem.id)}
        >
          <Text style={styles.classText}>{classItem.name}</Text>
          <Text style={styles.classDescription}>{classItem.description}</Text>
        </TouchableOpacity>
      ))}
      
      {userClassFromLogin && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('Home', { userClass: userClassFromLogin })}
        >
          <Text style={styles.continueText}>Continue with {userClassFromLogin}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
  },
  classButton: {
    padding: 15,
    margin: 10,
    backgroundColor: '#333',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedButton: {
    borderColor: '#0066cc',
    backgroundColor: '#004499',
  },
  currentClassButton: {
    borderColor: '#00cc66',
    backgroundColor: '#004422',
  },
  classText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  classDescription: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 5,
  },
  continueButton: {
    padding: 15,
    margin: 10,
    backgroundColor: '#00cc66',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClassSelectionScreen;