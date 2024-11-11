// MyProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { getUserData, updateProfile, initializeDatabase } from '../database/database';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './MyProfileStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [empId, setEmpId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    // Initialize the database once when the component mounts
    initializeDatabase();

    const loadProfileData = async () => {
      // Retrieve emp_id from AsyncStorage
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        const { emp_id } = JSON.parse(storedUserData);

        // Log emp_id to verify it's being fetched correctly
        console.log('emp_id from AsyncStorage:', emp_id);

        if (emp_id) {
          getUserData(emp_id, (error, userData) => {
            if (error) {
              console.error('Error loading user data:', error);
            } else if (userData) {
              // Log the retrieved user data to the console
              console.log('User Data retrieved from DB:', userData);

              setName(userData.name);
              setEmpId(userData.emp_id);
              setPhone(userData.phone);
              setEmail(userData.email);
              setAddress(userData.address || '');
            } else {
              console.log('No user data found for emp_id:', emp_id);
            }
          });
        }
      } else {
        console.log('No user data found in AsyncStorage.');
      }
    };

    loadProfileData();
  }, []);

  const handleProfileUpdate = () => {
    // Update profile in the database
    updateProfile(name, phone, email, address, empId, (error) => {
      if (error) {
        Alert.alert('Error', 'Failed to update profile');
      } else {
        // Show success message
        Alert.alert('Success', 'Profile updated successfully');
        
        // Optionally, navigate back or refresh screen
        navigation.goBack();
      }
    });
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
