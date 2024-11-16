import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './MyProfileStyles';

const API_URL = 'http://172.20.10.7:5000/api/users'; // Update this with your backend URL

const MyProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [empId, setEmpId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const { emp_id } = JSON.parse(storedUserData);

          // Fetch user data from the backend
          const response = await axios.get(`${API_URL}/profile/${emp_id}`);
          const userData = response.data;
          console.log(userData);
          

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
      }
    };

    loadProfileData();
  }, []);

  const handleProfileUpdate = async () => {
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
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonContainer}
        >
          <Icon name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Profile</Text>
      </View>
      <View style={styles.container}>
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
      </View>
    </SafeAreaView>
  );
};

export default MyProfileScreen;
