import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { login } from '../services/authService';
import styles from './LoginStyles';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);



  const logStoredUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      console.log('Stored user data:', storedUserData ? JSON.parse(storedUserData) : 'No data found');
    } catch (error) {
      console.error('Error fetching user data from AsyncStorage:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const user = await login(username, password);

      // Store user data in AsyncStorage regardless of "Remember Me" option
      await AsyncStorage.setItem(
        'userData',
        JSON.stringify({
          name: user.name,
          emp_id: user.emp_id,
          role: user.role,
          rememberMe, // store rememberMe status
        })
      );

      console.log('User data stored in AsyncStorage');
      await logStoredUserData();

      // Navigate based on user role
      if (user.role === 'admin') {
        Alert.alert("Success", "Admin logged in");
        navigation.navigate('AdminScreen');
      } else {
        Alert.alert("Success", "User logged in");
        navigation.navigate('UserScreen');
      }
    } catch (error) {
      Alert.alert('Login failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://path-to-your-background-image.png' }}
        style={styles.background}
      >
        <View style={styles.header}>
          <Text style={styles.title}>CONNECTING</Text>
          <Text style={styles.subtitle}>Deal With Your Dealer And Customer</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>User</Text>

          <TextInput
            placeholder="User ID"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              style={styles.passwordInput}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeIcon}
            >
              <Icon
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={24}
                color="#666666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={rememberMe}
                onValueChange={setRememberMe}
                tintColors={{ true: '#ff7f7f', false: '#666666' }}
              />
              <Text style={styles.label}>Remember me</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
