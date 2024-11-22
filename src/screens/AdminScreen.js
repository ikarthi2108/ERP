import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import AdminScreenStyles from './AdminScreenStyles';
import Profile from '../assets/profile.png';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Loader from '../components/Loader';
import Logout from '../utils/Logout';

const API_URL = 'https://krishna-a4lf.onrender.com/api/forms';
const Tab = createMaterialTopTabNavigator();

const TabScreen = ({ data, showButtons }) => {
  const navigation = useNavigation();

  const handleItemClick = item => {
    navigation.navigate('Detail', { item });
  };

  return (
    <ScrollView style={AdminScreenStyles.contentContainer}>
      {Object.keys(data).length === 0 ? (
        <Text style={AdminScreenStyles.noRequests}>No requests</Text>
      ) : (
        Object.entries(data).map(([date, items]) => (
          <View key={date}>
            <Text style={AdminScreenStyles.dateHeader}>{date}</Text>
            {items.map(item => (
              <TouchableOpacity
                key={item._id}
                style={AdminScreenStyles.card}
                onPress={() => handleItemClick(item)}>
                <Image source={Profile} style={AdminScreenStyles.image} />
                <View style={AdminScreenStyles.cardContent}>
                  <Text style={AdminScreenStyles.label}>User Name:</Text>
                  <Text style={AdminScreenStyles.details}>{item.name}</Text>
                  <Text style={AdminScreenStyles.label}>Employee ID:</Text>
                  <Text style={AdminScreenStyles.details}>{item.emp_id}</Text>
                  <Text style={AdminScreenStyles.label}>City:</Text>
                  <Text style={AdminScreenStyles.CityName}>{item.city}</Text>
                  <Text style={AdminScreenStyles.label}>Request ID:</Text>
                  <Text style={AdminScreenStyles.requestId}>
                    {item.requestId}
                  </Text>
                  <Text style={AdminScreenStyles.label}>Enterprise Name:</Text>
                  <Text style={AdminScreenStyles.companyName}>
                    {item.enterpriseName}
                  </Text>
                  <Text style={AdminScreenStyles.label}>Owner:</Text>
                  <Text style={AdminScreenStyles.details}>
                    {item.ownerName}
                  </Text>
                  <Text style={AdminScreenStyles.label}>City:</Text>
                  <Text style={AdminScreenStyles.details}>{item.city}</Text>
                  <Text style={AdminScreenStyles.label}>
                    Registered Date & Time:
                  </Text>
                  <Text style={AdminScreenStyles.details}>
                    {item.createdDate} {item.createdTime}
                  </Text>
                  {item.reason && (
                    <View style={AdminScreenStyles.reasonContainer}>
                      <Text style={AdminScreenStyles.reasonText}>
                        Reason: {item.reason}
                      </Text>
                    </View>
                  )}
                </View>
                <View
                  style={[
                    AdminScreenStyles.statusContainer,
                    {
                      backgroundColor: item.isPending
                        ? '#FFA726'
                        : item.isAccepted
                        ? '#4CAF50'
                        : item.isRejected
                        ? '#F44336'
                        : '#BDBDBD',
                    },
                  ]}>
                  <Text style={AdminScreenStyles.status}>
                    {item.isPending
                      ? 'Pending'
                      : item.isAccepted
                      ? 'Approved'
                      : item.isRejected
                      ? 'Rejected'
                      : 'Unknown'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const AdminScreen = ({ navigation }) => {
  const [data, setData] = useState({
    pendingData: {},
    approvedData: {},
    rejectedData: {},
  });
  const [loading, setLoading] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnim = useState(new Animated.Value(-250))[0];
  const { showLogoutConfirmation } = Logout();

  const toggleSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: sidebarVisible ? -250 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setSidebarVisible(!sidebarVisible);
  };

  const handleOverlayPress = () => {
    if (sidebarVisible) toggleSidebar();
  };

  const fetchRequestsFromAPI = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      if (response.status === 200) {
        const groupedData = groupDataByStatus(response.data);
        setData(groupedData);
      }
    } catch (error) {
      console.error('Error fetching requests from API:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupDataByStatus = requests => {
    const grouped = {
      pendingData: {},
      approvedData: {},
      rejectedData: {},
    };
    requests.forEach(request => {
      const date = new Date(request.createdDate).toLocaleDateString();
      const statusKey = request.isPending
        ? 'pendingData'
        : request.isAccepted
        ? 'approvedData'
        : 'rejectedData';

      if (!grouped[statusKey][date]) {
        grouped[statusKey][date] = [];
      }
      grouped[statusKey][date].push(request);
    });
    return grouped;
  };

  const getRequestCount = data => {
    return Object.values(data).reduce(
      (total, items) => total + items.length,
      0
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchRequestsFromAPI();
    }, [])
  );

  const pendingCount = getRequestCount(data.pendingData);
  const approvedCount = getRequestCount(data.approvedData);
  const rejectedCount = getRequestCount(data.rejectedData);

  return (
    <TouchableWithoutFeedback onPress={handleOverlayPress}>
      <View style={AdminScreenStyles.container}>
        {loading && <Loader />}

        {sidebarVisible && <View style={AdminScreenStyles.overlay} />}
        <Animated.View style={[AdminScreenStyles.sidebar, { left: sidebarAnim }]}>
          <Text style={AdminScreenStyles.sidebarTitle}>ADMIN</Text>
          <TouchableOpacity
            style={AdminScreenStyles.sidebarButton}
            onPress={() => navigation.navigate('AddDealerScreen')}>
            <Text style={AdminScreenStyles.sidebarButtonText}>Add New Employee</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={AdminScreenStyles.sidebarButton}
            onPress={() => navigation.navigate('EmployeeList')}>
            <Text style={AdminScreenStyles.sidebarButtonText}>Employee List</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={AdminScreenStyles.sidebarButton}
            onPress={() => navigation.navigate('ManageForm')}>
            <Text style={AdminScreenStyles.sidebarButtonText}>Manage Forms</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={AdminScreenStyles.sidebarButton}
            onPress={showLogoutConfirmation}>
            <Text style={AdminScreenStyles.sidebarButtonText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={AdminScreenStyles.header}>
          <TouchableOpacity
            onPress={toggleSidebar}
            style={AdminScreenStyles.menuIconContainer}>
            <Icon name="bars" size={24} color="#000" />
          </TouchableOpacity>
          <View style={AdminScreenStyles.headerTextContainer}>
            <Text style={AdminScreenStyles.title}>CONNECTING</Text>
            <Text style={AdminScreenStyles.subtitle}>
              Deal With Your Dealer And Customer
            </Text>
          </View>
          <TouchableOpacity
            onPress={fetchRequestsFromAPI}
            style={AdminScreenStyles.refreshIconContainer}>
            <Icon name="refresh" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <Tab.Navigator tabBarOptions={{ scrollEnabled: true }}>
          <Tab.Screen
            name={`Pending (${pendingCount})`}
            children={() => (
              <TabScreen data={data.pendingData} showButtons={true} />
            )}
          />
          <Tab.Screen
            name={`Approved (${approvedCount})`}
            children={() => (
              <TabScreen data={data.approvedData} showButtons={false} />
            )}
          />
          <Tab.Screen
            name={`Rejected (${rejectedCount})`}
            children={() => (
              <TabScreen data={data.rejectedData} showButtons={false} />
            )}
          />
        </Tab.Navigator>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AdminScreen;