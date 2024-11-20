import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import Loader from '../components/Loader'; 

// Replace this with your actual backend URL
const API_URL = 'https://krishna-a4lf.onrender.com/api/users';

const AddDealerScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle adding a new dealer
  const handleAddDealer = async () => {
    if (!username || !password || !name) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setLoading(true); // Show loader
    try {
      const response = await axios.post(`${API_URL}/add-dealer`, {
        username,
        password,
        name,
      });

      Alert.alert('Success', response.data.message);
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      console.error('Error adding dealer:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to add dealer. Please try again.'
      );
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <View style={styles.container}>
      {loading && <Loader message="Adding Dealer..." />}
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
        <Text style={styles.label}>Dealer Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter Dealer's Name"
          placeholderTextColor="#aaa"
        />

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
    backgroundColor: '#f7f8fc',
  },
  headerContainer: {
    backgroundColor: '#ff7f7f',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 4,
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
    color: '#444',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#ff7f7f',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#ff7f7f',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
});

export default AddDealerScreen;
