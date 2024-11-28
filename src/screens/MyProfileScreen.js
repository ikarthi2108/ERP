import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Loader from '../components/Loader';
import styles from './MyProfileStyles';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { uploadImageToS3 } from '../api/s3Uploader';

// API URL
// const API_URL = 'http://172.20.10.7:5000/api/users';

const API_URL = 'https://krishna-a4lf.onrender.com/api/users';

// const API_URL = 'http://103.235.106.98:5000/api/users';



const MyProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [empId, setEmpId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [profileImg, setProfileImg] = useState(''); // To store the profile image URL or path
  const [aadharPhoto, setAadharPhoto] = useState(''); // To store Aadhar photo
  const [licensePhoto, setLicensePhoto] = useState(''); // To store Driving License photo
  const [drivingLicenseNo, setDrivingLicenseNo] = useState(''); // To store Driving License Number
  const [loading, setLoading] = useState(false); // To manage loader state
  const [aadharAdded, setAadharAdded] = useState(false); // To track if Aadhar image is added successfully
  const [licenseAdded, setLicenseAdded] = useState(false); // To track if License image is added successfully

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true); // Show loader when fetching data
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
          setProfileImg(userData.profile_img || ''); // Set profile image URL if exists
          setAadharPhoto(userData.aadhar_photo || ''); // Set Aadhar photo URL if exists
          setLicensePhoto(userData.license_photo || ''); // Set License photo URL if exists
          setDrivingLicenseNo(userData.driving_license_no || ''); // Set Driving License No if exists
        } else {
          console.log('No user data found in AsyncStorage.');
        }
      } catch (error) {
        console.error('Error loading user data:', error.response?.data || error.message);
        Alert.alert('Error', 'Failed to load user data.');
      } finally {
        setLoading(false); // Hide loader after data is loaded
      }
    };

    loadProfileData();
  }, []);

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/profile/${empId}`, {
        name,
        phone,
        email,
        address,
        profile_img: profileImg, // Use the S3 image URL
        aadhar_photo: aadharPhoto, // Aadhar photo URL
        license_photo: licensePhoto, // License photo URL
        driving_license_no: drivingLicenseNo, // Driving License number
      });

      Alert.alert('Success', response.data.message);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const selectImage = (type) => {
    const options = { mediaType: 'photo', quality: 0.5 };

    Alert.alert('Select Image', 'Choose from Camera or Gallery', [
      {
        text: 'Camera',
        onPress: () => launchCamera(options, (response) => handleImageSelection(response, type)),
      },
      {
        text: 'Gallery',
        onPress: () => launchImageLibrary(options, (response) => handleImageSelection(response, type)),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleImageSelection = async (response, type) => {
    if (response.didCancel) {
      console.log('User canceled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else {
      const imageUri = response.assets[0].uri;
      const fileName = `${type}-${Date.now()}_${response.assets[0].fileName}`;

      try {
        setLoading(true); // Show loader
        const uploadedImageUrl = await uploadImageToS3(imageUri, fileName);
        if (type === 'profile') {
          setProfileImg(uploadedImageUrl); // Update profile image URL
        } else if (type === 'aadhar-photo') {
          setAadharPhoto(uploadedImageUrl); // Update Aadhar photo URL
          setAadharAdded(true); // Set Aadhar added success state
        } else if (type === 'driving-license-photo') {
          setLicensePhoto(uploadedImageUrl); // Update Driving License photo URL
          setLicenseAdded(true); // Set License added success state
        }

        console.log(`${type} uploaded to S3:`, uploadedImageUrl);
      } catch (error) {
        Alert.alert('Error', 'Failed to upload image.');
      } finally {
        setLoading(false); // Hide loader
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
            <Icon name="chevron-back" size={30} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerText}>My Profile</Text>
        </View>

        {/* Loader */}
        {loading && <Loader message="Loading..." />}

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.label}>Profile Image</Text>
              <TouchableOpacity onPress={() => selectImage('profile')} style={styles.profileImageContainer}>
                <Image
                  source={profileImg ? { uri: profileImg } : require('../assets/profile.png')}
                  style={styles.profileImage}
                />
              </TouchableOpacity>

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

              {/* Aadhar Photo */}
              <Text style={styles.label}>Aadhar Photo</Text>
              <TouchableOpacity onPress={() => selectImage('aadhar-photo')} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Photo</Text>
              </TouchableOpacity>
              {aadharAdded && <Text style={styles.imageSuccessText}>Aadhar Photo added successfully!</Text>}

              {/* Driving License Photo */}
              <Text style={styles.label}>License Photo</Text>
              <TouchableOpacity onPress={() => selectImage('driving-license-photo')} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Photo</Text>
              </TouchableOpacity>
              {licenseAdded && <Text style={styles.imageSuccessText}>Driving License Photo added successfully!</Text>}

              {/* Driving License Number */}
              <Text style={styles.label}>Driving License Number</Text>
              <TextInput
                value={drivingLicenseNo}
                onChangeText={setDrivingLicenseNo}
                style={styles.input}
                keyboardType="phone-pad"
              />

              <TouchableOpacity onPress={handleProfileUpdate} style={styles.updateButton}>
                <Text style={styles.updateButtonText}>Update Profile</Text>
              </TouchableOpacity>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfileScreen;
