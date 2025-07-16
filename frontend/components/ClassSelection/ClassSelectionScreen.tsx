import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const classes = [
  { id: 'warrior', name: 'Warrior' },
  { id: 'mage', name: 'Mage' },
  { id: 'rogue', name: 'Rogue' },
  { id: 'cleric', name: 'Cleric' },
];

const ClassSelectionScreen = ({ navigation }) => {
  const handleClassSelect = (selectedClass) => {
    // Handle class selection logic here
    console.log(`Selected class: ${selectedClass}`);
    // Navigate to the next screen or update user state
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Class</Text>
      {classes.map((classItem) => (
        <TouchableOpacity
          key={classItem.id}
          style={styles.classButton}
          onPress={() => handleClassSelect(classItem.name)}
        >
          <Text style={styles.classText}>{classItem.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  classButton: {
    padding: 15,
    margin: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  classText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ClassSelectionScreen;