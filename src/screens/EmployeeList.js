import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import Profile from '../assets/profile.png';
import styles from './EmployeeListStyles';

const API_URL = 'https://krishna-a4lf.onrender.com/api/users';

const EmployeeList = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.status === 200) {
          setEmployees(response.data);
          setFilteredEmployees(response.data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);



  const handleViewDetails = (employee) => {
    navigation.navigate('EmployeeDetails', { employee });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff4500" />
        <Text style={styles.loadingText}>Loading Employee List...</Text>
      </View>
    );
  }

  if (filteredEmployees.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No employees found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonContainer}
        >
          <Icon name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Employee List</Text>
      </View>

    

      {/* Employee List */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.grid}>
          {filteredEmployees.map((employee) => (
            <View key={employee.emp_id} style={styles.card}>
              <Image source={Profile} style={styles.image} />
              <Text style={styles.name}>{employee.name}</Text>
              <Text style={styles.detail}>ID: {employee.emp_id}</Text>
              <Text style={styles.detail}>Phone: {employee.phone || 'Yet To Update'}</Text>
              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => handleViewDetails(employee)}
              >
                <Text style={styles.viewDetailsText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default EmployeeList;
