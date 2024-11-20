import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Loader from '../components/Loader'; // Importing Loader component
import styles from './MyProfileStyles';

// API URL
const API_URL = 'https://krishna-a4lf.onrender.com/api/users';

const MyProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [empId, setEmpId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false); // To manage loader state

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true); // Show loader when fetching data
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const { emp_id } = JSON.parse(storedUserData);

          // Fetch user data from the backend
          const response = await axios.get(`${API_URL}/profile/${emp_id}`);
          const userData = response.data;

          // Update state with user data
          setName(userData.name);
          setEmpId(userData.emp_id);
          setPhone(userData.phone || '');
          setEmail(userData.email || '');
          setAddress(userData.address || '');
        } else {
          console.log('No user data found in AsyncStorage.');
        }
      } catch (error) {
        console.error('Error loading user data:', error.response?.data || error.message);
        Alert.alert('Error', 'Failed to load user data.');
      } finally {
        setLoading(false); // Hide loader after data is loaded
      }
    };

    loadProfileData();
  }, []);

  const handleProfileUpdate = async () => {
    setLoading(true); // Show loader during profile update
    try {
      const response = await axios.put(`${API_URL}/profile/${empId}`, {
        name,
        phone,
        email,
        address,
      });

      Alert.alert('Success', response.data.message);
      navigation.goBack(); // Optionally go back after update
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false); // Hide loader after update
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Icon name="chevron-back" size={30} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Profile</Text>
      </View>

      {/* Loader */}
      {loading && <Loader message="Loading..." />}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} />

            <Text style={styles.label}>Employee ID</Text>
            <TextInput value={empId} editable={false} style={styles.inputDisabled} />

            <Text style={styles.label}>Phone No</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Email ID</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              style={[styles.input, styles.textArea]}
              multiline
            />

            <TouchableOpacity onPress={handleProfileUpdate} style={styles.updateButton}>
              <Text style={styles.updateButtonText}>Update Profile</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfileScreen;
