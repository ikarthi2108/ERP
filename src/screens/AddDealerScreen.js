// AddDealerScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { addUserToDatabase, initializeDatabase } from '../database/database';
import Icon from 'react-native-vector-icons/Ionicons';

const AddDealerScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Initialize the database only once when the component mounts
    initializeDatabase();
  }, []);

  const handleAddDealer = () => {
    // Validate inputs
    if (!username || !password) {
      Alert.alert('Error', 'Username and Password are required');
      return;
    }

    // Add user to the database
    addUserToDatabase(username, password, (error) => {
      if (error) {
        Alert.alert('Error', 'Failed to add dealer');
      } else {
        Alert.alert('Success', 'Dealer added successfully');
        navigation.goBack(); // Go back to the previous screen
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonContainer}
        >
          <Icon name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add New Dealer</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter Username"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter Password"
          placeholderTextColor="#aaa"
          secureTextEntry
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddDealer}>
          <Text style={styles.addButtonText}>Add Dealer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
  },
  headerContainer: {
    backgroundColor: '#f77f7f',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButtonContainer: {
    marginRight: 12,
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#f77f7f',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddDealerScreen;
