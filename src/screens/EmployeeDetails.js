import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const EmployeeDetails = ({ route, navigation }) => {
  const { employee } = route.params;

  const getDisplayValue = (value) => (value ? value : 'Yet To Update');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Employee Details</Text>
      </View>

      {/* Details */}
      <ScrollView style={styles.detailsContainer}>
        {/* Profile Image */}
        <View style={styles.imageContainer}>
          {employee.profile_img ? (
            <Image
              source={{ uri: employee.profile_img }}
              style={styles.image}
            />
          ) : (
            <Text style={styles.placeholderText}>Profile Image not added</Text>
          )}
        </View>

        {/* Employee Info */}
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Name:</Text> {getDisplayValue(employee.name)}
        </Text>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>ID:</Text> {getDisplayValue(employee.emp_id)}
        </Text>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Username:</Text> {getDisplayValue(employee.username)}
        </Text>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Email:</Text> {getDisplayValue(employee.email)}
        </Text>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Phone:</Text> {getDisplayValue(employee.phone)}
        </Text>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Address:</Text> {getDisplayValue(employee.address)}
        </Text>
        <Text style={styles.label}>Driving License No:</Text>

        {/* Driving License */}
        <View style={styles.imageContainer}>
          {employee.license_photo ? (
            <Image
              source={{ uri: employee.license_photo }}
              style={styles.image}
            />
          ) : (
            <Text style={styles.placeholderText}>Driving License Image not added</Text>
          )}
        </View>
        <Text style={styles.detailItem}>
          {getDisplayValue(employee.driving_license_no)}
        </Text>

        {/* Aadhar Image */}
        <View style={styles.imageContainer}>
          {employee.aadhar_photo ? (
            <Image
              source={{ uri: employee.aadhar_photo }}
              style={styles.image}
            />
          ) : (
            <Text style={styles.placeholderText}>Aadhar Image not added</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#febca5',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  backButton: { marginRight: 12 },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 16,
  },
  detailItem: { fontSize: 16, marginVertical: 6 },
  label: { fontWeight: 'bold', color: '#333' },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  image: { width: 150, height: 150, resizeMode: 'cover', borderRadius: 8 },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default EmployeeDetails;
