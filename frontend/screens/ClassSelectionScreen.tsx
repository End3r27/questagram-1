import React, { useState } from 'react';
import { View, Text, Button, Picker, StyleSheet } from 'react-native';

const classes = [
  { label: 'Warrior', value: 'Warrior' },
  { label: 'Mage', value: 'Mage' },
  { label: 'Rogue', value: 'Rogue' },
  { label: 'Cleric', value: 'Cleric' },
];

export default function ClassSelectionScreen({ navigation, route }) {
  const [selectedClass, setSelectedClass] = useState(classes[0].value);

  const handleSelect = () => {
    // You can send this to your backend or save in context/state
    // For now, just navigate to the profile or home
    navigation.navigate('Home', { userClass: selectedClass });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Class</Text>
      <Picker
        selectedValue={selectedClass}
        onValueChange={setSelectedClass}
        style={styles.picker}
      >
        {classes.map(cls => (
          <Picker.Item key={cls.value} label={cls.label} value={cls.value} />
        ))}
      </Picker>
      <Button title="Select" onPress={handleSelect} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  picker: { width: 200, marginBottom: 20 },
});