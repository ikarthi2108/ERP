import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Logout from '../utils/Logout';
import Profile from '../assets/profile.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './UserScreenStyles';
import { useFocusEffect } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const Card = ({ item, status }) => (
  <View style={styles.cardContainer}>
    <Image source={Profile} style={styles.profileImage} />
    <View style={styles.cardContent}>
      <Text style={styles.companyName}> Req ID: {item.requestId || 'N/A'}</Text>
      <Text style={styles.companyName}>{item.enterpriseName || 'N/A'}</Text>
      <Text style={styles.infoText}>Owner: {item.ownerName || 'N/A'}</Text>
      <Text style={styles.infoText}>Serial No: {item.regNo || 'N/A'}</Text>
      <Text style={styles.infoText}>City: {item.city || 'N/A'}</Text>
      <Text style={styles.infoText}>
        Registered Date & Time: {item.createdDate} {item.createdTime}
      </Text>
      {status === 'Rejected' && item.reason && (
        <Text style={styles.rejectionReason}>
          Reason: {item.reason}
        </Text>
      )}
    </View>
    <View style={styles.statusContainer}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  </View>
);

const DataListScreen = ({ data, status }) => (
  <ScrollView style={styles.scrollContainer}>
    {Object.keys(data).map(date => (
      <View key={date}>
        <Text style={styles.sectionTitle}>{date}</Text>
        {data[date].map((item, index) => (
          <Card key={`${date}-${index}`} item={item} status={status} />
        ))}
      </View>
    ))}
  </ScrollView>
);

const UserScreen = ({ navigation }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerAnimation] = useState(new Animated.Value(-250));
  const { loading, showLogoutConfirmation } = Logout();
  const [pendingData, setPendingData] = useState({});
  const [approvedData, setApprovedData] = useState({});
  const [rejectedData, setRejectedData] = useState({});
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [empId, setEmpId] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setEmpId(parsedData.emp_id);
          setName(parsedData.name);
        }
      } catch (error) {
        console.error('Error getting user data from AsyncStorage', error);
      }
    };

    getUserData();
  }, []);

 

  useEffect(() => {
    if (empId) {
      const loadData = async () => {
        try {
          const response = await axios.get(`http://172.20.10.7:5000/api/forms/${empId}`);
          const { pending, approved, rejected } = response.data;
          setPendingData(pending);
          setApprovedData(approved);
          setRejectedData(rejected);

          const pendingCount = Object.values(pending).reduce(
            (acc, arr) => acc + arr.length,
            0
          );
          const approvedCount = Object.values(approved).reduce(
            (acc, arr) => acc + arr.length,
            0
          );
          const rejectedCount = Object.values(rejected).reduce(
            (acc, arr) => acc + arr.length,
            0
          );

          setPendingCount(pendingCount);
          setApprovedCount(approvedCount);
          setRejectedCount(rejectedCount);

        } catch (error) {
          console.error('Error fetching data by emp_id:', error);
        }
      };

      loadData();
    }
  }, [empId]);

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      Animated.timing(drawerAnimation, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsDrawerOpen(false));
    } else {
      setIsDrawerOpen(true);
      Animated.timing(drawerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.hamburgerMenu} onPress={toggleDrawer}>
          <Icon name="menu" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>CONNECTING</Text>
        <Text style={styles.subHeaderText}>
          Deal With Your Dealer And Customer
        </Text>
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarStyle: { backgroundColor: 'white' },
          tabBarIndicatorStyle: { backgroundColor: '#FF6A6A' },
        }}
      >
        <Tab.Screen
          name="UserPendingScreen"
          children={() => <DataListScreen data={pendingData} status="Pending" />}
          options={{ title: `Pending (${pendingCount})` }}
        />
        <Tab.Screen
          name="UserApprovalScreen"
          children={() => <DataListScreen data={approvedData} status="Approved" />}
          options={{ title: `Approval (${approvedCount})` }}
        />
        <Tab.Screen
          name="UserRejectedScreen"
          children={() => <DataListScreen data={rejectedData} status="Rejected" />}
          options={{ title: `Rejected (${rejectedCount})` }}
        />
      </Tab.Navigator>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddNewForm')}
      >
        <Text style={styles.addButtonText}>ADD NEW DATA</Text>
      </TouchableOpacity>

      {isDrawerOpen && (
        <TouchableOpacity style={styles.drawerOverlay} onPress={toggleDrawer} />
      )}
      <Animated.View
        style={[
          styles.drawerContainer,
          { transform: [{ translateX: drawerAnimation }] },
        ]}
      >
        <View style={styles.profileContainer}>
          <Image source={Profile} style={styles.drawerProfileImage} />
          <Text style={styles.drawerUserName}>{name}</Text>
          <Text style={styles.drawerUserId}>{empId}</Text>
        </View>
        <TouchableOpacity
          style={styles.drawerOption}
          onPress={() => navigation.navigate('MyProfileScreen')}
        >
          <Icon name="person" size={24} color="black" />
          <Text style={styles.drawerLabel}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerOption}
          onPress={showLogoutConfirmation}
        >
          <Icon name="logout" size={24} color="black" />
          <Text style={styles.drawerLabel}>Log Out</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal visible={loading} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#FF6A6A" />
            <Text style={styles.modalText}>Logging out...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserScreen;
