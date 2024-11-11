// src/utils/Logout.js

import React, { useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log('Error clearing AsyncStorage', error);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setTimeout(async () => {
      await clearAsyncStorage();
      setLoading(false);
      navigation.navigate('Login'); 
    }, 1000); 
  };

  const showLogoutConfirmation = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          onPress: handleLogout,
        },
      ],
      { cancelable: false }
    );
  };

  return { loading, showLogoutConfirmation };
};

export default Logout;
