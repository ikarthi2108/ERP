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
  Alert,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Logout from '../utils/Logout';
import Profile from '../assets/profile.png'; // Default profile image
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './UserScreenStyles';

const Tab = createMaterialTopTabNavigator();

const Card = ({ item, status, onPress }) => (
  <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
    <Image source={Profile} style={styles.profileImage} />
    <View style={styles.cardContent}>
      <Text style={styles.companyName}>Req ID: {item.requestId || 'N/A'}</Text>
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
  </TouchableOpacity>
);

const DataListScreen = ({ data, status, isLoading, onCardPress }) => {
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF6A6A" />
        <Text style={styles.loaderText}>Loading Data...</Text>
      </View>
    );
  }

  if (Object.keys(data).length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No Data Found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      {Object.keys(data).map(date => (
        <View key={date}>
          <Text style={styles.sectionTitle}>{date}</Text>
          {data[date].map((item, index) => (
            <Card key={`${date}-${index}`} item={item} status={status} onPress={() => onCardPress(item)} />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

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
  const [isLoading, setIsLoading] = useState(false);
  const [profileSidebar, setProfileSidebar] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

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

  const API_URL = 'https://krishna-a4lf.onrender.com/api/users';

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true); // Show loader when fetching data
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const { emp_id } = JSON.parse(storedUserData);

          // Fetch user data from the backend
          const response = await axios.get(`${API_URL}/profile/${emp_id}`);
          const userData = response.data;
          console.log('User Data:', userData);

          setProfileSidebar(userData); 
        } else {
          console.log('No user data found in AsyncStorage.');
        }
      } catch (error) {
        console.error('Error loading user data:', error.response?.data || error.message);
        Alert.alert('Error', 'Failed to load user data.');
      } finally {
        setIsLoading(false); // Hide loader after data is loaded
      }
    };

    fetchProfileData();
  }, []);

  const fetchData = async () => {
    if (!empId) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://krishna-a4lf.onrender.com/api/forms/${empId}`
      );
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
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [empId]);

  const handleRefresh = () => {
    fetchData();
  };

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

  const handleCardPress = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.hamburgerMenu} onPress={toggleDrawer}>
          <Icon name="menu" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>CONNECTING</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Icon name="refresh" size={28} color="black" />
        </TouchableOpacity>
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
          children={() => <DataListScreen data={pendingData} status="Pending" isLoading={isLoading} onCardPress={handleCardPress} />}
          options={{ title: `Pending (${pendingCount})` }}
        />
        <Tab.Screen
          name="UserApprovalScreen"
          children={() => <DataListScreen data={approvedData} status="Approved" isLoading={isLoading} onCardPress={handleCardPress} />}
          options={{ title: `Approved (${approvedCount})` }}
        />
        <Tab.Screen
          name="UserRejectedScreen"
          children={() => <DataListScreen data={rejectedData} status="Rejected" isLoading={isLoading} onCardPress={handleCardPress} />}
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
        style={[styles.drawerContainer, { transform: [{ translateX: drawerAnimation }] }]}
      >
        <View style={styles.profileContainer}>
          <Image
            source={
              profileSidebar.profile_img
                ? { uri: profileSidebar.profile_img }
                : Profile
            }
            style={styles.drawerProfileImage}
          />
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

      <Modal visible={selectedItem !== null} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Full Details</Text>
            <Text style={styles.modalText}>Req ID: {selectedItem?.requestId || 'N/A'}</Text>
            <Text style={styles.modalText}>Enterprise Name: {selectedItem?.enterpriseName || 'N/A'}</Text>
            <Text style={styles.modalText}>Owner Name: {selectedItem?.ownerName || 'N/A'}</Text>
            <Text style={styles.modalText}>Address: {selectedItem?.address || 'N/A'}</Text>
            <Text style={styles.modalText}>City: {selectedItem?.city || 'N/A'}</Text>
            <Text style={styles.modalText}>Pincode: {selectedItem?.pincode || 'N/A'}</Text>
            <Text style={styles.modalText}>Mobile No: {selectedItem?.mobileNo || 'N/A'}</Text>
            <Text style={styles.modalText}>Email: {selectedItem?.email || 'N/A'}</Text>
            <Text style={styles.modalText}>GST No: {selectedItem?.gstNo || 'N/A'}</Text>
            <Text style={styles.modalText}>DTP No: {selectedItem?.dtpNo || 'N/A'}</Text>
            <Text style={styles.modalText}>Location: {selectedItem?.location || 'N/A'}</Text>
            <Text style={styles.modalText}>Reg No: {selectedItem?.regNo || 'N/A'}</Text>
            <Text style={styles.modalText}>Category: {selectedItem?.category || 'N/A'}</Text>
            <Text style={styles.modalText}>Sub Category: {selectedItem?.subCategory || 'N/A'}</Text>
            <Text style={styles.modalText}>Dealer: {selectedItem?.dealer || 'N/A'}</Text>
            <Text style={styles.modalText}>Additional Items: {selectedItem?.additionalItems || 'N/A'}</Text>
            <Text style={styles.modalText}>Created Date: {selectedItem?.createdDate || 'N/A'}</Text>
            <Text style={styles.modalText}>Created Time: {selectedItem?.createdTime || 'N/A'}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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