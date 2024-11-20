import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import Loader from '../components/Loader';
import NoInternetScreen from '../components/NoInternetScreen';
import { login } from '../services/authService';
import styles from './LoginStyles';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Subscribe to internet connectivity status
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const user = await login(username, password);

      // Store user data in AsyncStorage
      await AsyncStorage.setItem(
        'userData',
        JSON.stringify({
          name: user.name,
          emp_id: user.emp_id,
          role: user.role,
          rememberMe,
        })
      );

      // Navigate based on user role
      if (user.role === 'admin') {
        Alert.alert('Success', 'Admin logged in');
        navigation.navigate('AdminScreen');
      } else {
        Alert.alert('Success', 'User logged in');
        navigation.navigate('UserScreen');
      }
    } catch (error) {
      Alert.alert('Login failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return <NoInternetScreen onRetry={() => NetInfo.fetch()} />;
  }

  return (
    <View style={styles.container}>
      {isLoading && <Loader message="Logging in..." />}
      <Image source={require('../assets/logo.jpg')} style={styles.logo} />
      <View style={styles.header}>
        <Text style={styles.title}>CONNECTING</Text>
        <Text style={styles.subtitle}>Deal With Your Dealer And Customer</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Login</Text>
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
    </View>
  );
};

export default LoginScreen;
