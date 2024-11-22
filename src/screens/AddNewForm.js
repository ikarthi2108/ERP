import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import styles from './AddNewFormStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';
import Geolocation from 'react-native-geolocation-service';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import RNFS from 'react-native-fs';
import { uploadImageToS3 } from '../api/s3Uploader'; // Adjust the import path as necessary

const API_URL1 = 'https://krishna-a4lf.onrender.com/api/dropdownData';

const API_URL = 'https://krishna-a4lf.onrender.com/api/forms';


const AddNewForm = () => {
  const [loading, setLoading] = useState(false);
  const [isDetailedForm, setIsDetailedForm] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);

  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [subCategoryValue, setSubCategoryValue] = useState(null);
  const [subCategoryItems, setSubCategoryItems] = useState([]);

  const [dealerOpen, setDealerOpen] = useState(false);
  const [dealerValue, setDealerValue] = useState(null);
  const [dealerItems, setDealerItems] = useState([]);

  const [additionalItemsOpen, setAdditionalItemsOpen] = useState(false);
  const [additionalItemsValue, setAdditionalItemsValue] = useState(null);
  const [additionalItems, setAdditionalItems] = useState([]);

  // State variables for form fields
  const [enterpriseName, setEnterpriseName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [dtpNo, setDtpNo] = useState('');
  const [regNo, setRegNo] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [empId, setEmpId] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [location, setLocation] = useState(null);
  const [watchId, setWatchId] = useState(null); // State to store the watch ID
  const [locationString, setLocationString] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    getUserData();
    fetchDropdownData();
  }, []);

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      console.log(userData);

      if (userData) {
        const parsedData = JSON.parse(userData);
        setEmpId(parsedData.emp_id || '');
        setUserName(parsedData.name || '');
        setUserRole(parsedData.role || '');
      }
    } catch (error) {
      console.error('Error retrieving user data from AsyncStorage:', error);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const response = await axios.get(API_URL1);
      const data = response.data;

      const categories = [...new Set(data.map(item => item.category))].map(cat => ({ label: cat, value: cat }));
      const subCategories = [...new Set(data.map(item => item.subCategory))].map(subCat => ({ label: subCat, value: subCat }));
      const dealers = [...new Set(data.map(item => item.dealer))].map(dealer => ({ label: dealer, value: dealer }));
      const additionalItems = [...new Set(data.map(item => item.additionalItem))].map(addItem => ({ label: addItem, value: addItem }));

      setCategoryItems(categories);
      setSubCategoryItems(subCategories);
      setDealerItems(dealers);
      setAdditionalItems(additionalItems);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  const handleImageSelection = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const imageUris = response.assets.map(asset => asset.uri);
        const imageUrls = [];

        for (const imageUri of imageUris) {
          const fileName = `profile-${Date.now()}_${imageUri.split('/').pop()}`;

          try {
            setLoading(true); // Show loader
            const uploadedImageUrl = await uploadImageToS3(imageUri, fileName);
            imageUrls.push(uploadedImageUrl);
          } catch (error) {
            Alert.alert('Error', 'Failed to upload image.');
          } finally {
            setLoading(false); // Hide loader
          }
        }

        setSelectedImages(prevImages => [...prevImages, ...imageUrls]);
      }
    });
  };

  const handleRemoveImage = index => {
    setSelectedImages(prevImages =>
      prevImages.filter((_, idx) => idx !== index),
    );
  };

  const submitFormDataToAPI = async formData => {
    try {
      const response = await axios.post(API_URL, formData);
      setLoading(false); // Hide loader
      console.log(response.data.message);
      return response.data;
    } catch (error) {
      setLoading(false); // Hide loader
      console.error('Error submitting form data:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    console.log('User details on submit: ', { empId, userName, userRole });

    const requestId = Math.floor(10000 + Math.random() * 90000); // Generate random 5-digit number

    try {
      const formData = {
        requestId,
        enterpriseName,
        ownerName,
        address,
        city,
        pincode,
        mobileNo,
        email,
        gstNo,
        dtpNo,
        regNo,
        category: categoryValue,
        subCategory: subCategoryValue,
        dealer: dealerValue,
        additionalItems: additionalItemsValue,
        img1: selectedImages[0] || null,
        img2: selectedImages[1] || null,
        img3: selectedImages[2] || null,
        img4: selectedImages[3] || null,
        img5: selectedImages[4] || null,
        img6: selectedImages[5] || null,
        img7: selectedImages[6] || null,
        img8: selectedImages[7] || null,
        img9: selectedImages[8] || null,
        img10: selectedImages[9] || null,
        isPending: 1,
        isAccepted: 0,
        isRejected: 0,
        emp_id: empId,
        name: userName,
        role: userRole,
        reason: '', // If you don't have a reason, leave it as an empty string
        location: location ? `${location.latitude}, ${location.longitude}` : '',
      };

      setLoading(true);

      await submitFormDataToAPI(formData);

      console.log('Form data submitted successfully');

      // Display an alert and navigate on confirmation
      Alert.alert(
        'Success',
        'Your form has been submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to UserScreen
              navigation.navigate('UserScreen');
            },
          },
        ],
        { cancelable: false }, // Prevent closing alert without action
      );

      // Reset all form fields after submitting
      setEnterpriseName('');
      setOwnerName('');
      setAddress('');
      setCity('');
      setPincode('');
      setMobileNo('');
      setEmail('');
      setGstNo('');
      setDtpNo('');
      setRegNo('');
      setCategoryValue(null);
      setSubCategoryValue(null);
      setDealerValue(null);
      setAdditionalItemsValue(null);
      setSelectedImages([]);
      setIsDetailedForm(false); // Reset to initial view
      setLocation(null); // Reset location
    } catch (error) {
      console.error('Error submitting form data:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    setLoading(true); // Start the loader
    try {
      const permission = Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      });

      const status = await check(permission);

      if (status === RESULTS.GRANTED) {
        const id = Geolocation.watchPosition(
          position => {
            const coords = position.coords;
            setLocation(coords);
            const formattedLocation = `Latitude: ${coords.latitude.toFixed(
              6,
            )}, Longitude: ${coords.longitude.toFixed(
              6,
            )}, Accuracy: ${coords.accuracy.toFixed(2)} meters`;
            setLocationString(formattedLocation); // Set formatted string
            console.log('Location:', formattedLocation);
            setLoading(false); // Stop the loader
          },
          error => {
            console.log('Location Error:', error.code, error.message);
            setLoading(false); // Stop the loader
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
        setWatchId(id); // Store the watch ID
      } else if (status === RESULTS.DENIED) {
        const result = await request(permission);
        if (result === RESULTS.GRANTED) {
          requestLocationPermission();
        } else {
          setLoading(false); // Stop the loader if permission is denied
          Alert.alert(
            'Permission Denied',
            'Location permission is required to get your current location. Please enable it in the app settings.',
            [
              {
                text: 'Go to Settings',
                onPress: () => Linking.openSettings(),
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ],
          );
        }
      } else {
        setLoading(false); // Stop the loader if permission is permanently denied
        Alert.alert(
          'Permission Denied',
          'Location permission is required to get your current location. Please enable it in the app settings.',
          [
            {
              text: 'Go to Settings',
              onPress: () => Linking.openSettings(),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ],
        );
      }
    } catch (err) {
      console.warn('Location Permission Error:', err);
      setLoading(false); // Stop the loader in case of error
    }
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId); // Clear the watch when the component unmounts
      }
    };
  }, [watchId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonContainer}>
          <Icon name="chevron-back" size={30} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add New Details</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <FlatList
          data={[
            {
              type: 'text',
              placeholder: 'Name of the Enterprise',
              value: enterpriseName,
              setter: setEnterpriseName,
            },
            {
              type: 'text',
              placeholder: 'Name of the Owner',
              value: ownerName,
              setter: setOwnerName,
            },
            {
              type: 'text',
              placeholder: 'Address',
              value: address,
              setter: setAddress,
            },
            {
              type: 'row',
              fields: [
                {
                  type: 'text',
                  placeholder: 'City/Town',
                  value: city,
                  setter: setCity,
                },
                {
                  type: 'text',
                  placeholder: 'Pincode',
                  value: pincode,
                  setter: setPincode,
                  keyboardType: 'number-pad',
                },
              ],
            },
            {
              type: 'text',
              placeholder: 'Mobile No',
              value: mobileNo,
              setter: setMobileNo,
              keyboardType: 'number-pad',
            },
            {
              type: 'text',
              placeholder: 'Email ID',
              value: email,
              setter: setEmail,
            },
            {
              type: 'text',
              placeholder: 'GST No',
              value: gstNo,
              setter: setGstNo,
              keyboardType: 'number-pad',
            },
            {
              type: 'text',
              placeholder: 'DTP No',
              value: dtpNo,
              setter: setDtpNo,
              keyboardType: 'number-pad',
            },
          ]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            if (item.type === 'text') {
              return (
                <TextInput
                  placeholder={item.placeholder}
                  style={styles.input}
                  value={item.value}
                  onChangeText={item.setter}
                  keyboardType={item.keyboardType || 'default'} // Use 'default' if keyboardType is not specified
                />
              );
            }
            if (item.type === 'row') {
              return (
                <View style={styles.rowContainer}>
                  {item.fields.map((field, idx) => (
                    <TextInput
                      key={idx}
                      placeholder={field.placeholder}
                      style={[styles.input, styles.rowInput]}
                      value={field.value}
                      onChangeText={field.setter}
                      keyboardType={field.keyboardType || 'default'} // Use 'default' if keyboardType is not specified
                    />
                  ))}
                </View>
              );
            }
          }}
          ListFooterComponent={
            !isDetailedForm ? (
              <View style={styles.navigationButtons}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setIsDetailedForm(true)}>
                  <Text style={styles.backButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.label}>Other Reg No</Text>
                <TextInput
                  placeholder="Other Reg No"
                  style={styles.input}
                  value={regNo}
                  onChangeText={setRegNo}
                  keyboardType="number-pad"
                />
                <Text style={styles.label}>Category</Text>
                <DropDownPicker
                  open={categoryOpen}
                  value={categoryValue}
                  items={categoryItems}
                  setOpen={setCategoryOpen}
                  setValue={setCategoryValue}
                  setItems={setCategoryItems}
                  style={styles.dropdown}
                  placeholder="Select the Category"
                  dropDownContainerStyle={styles.dropdownContainer}
                />

                <Text style={styles.label}>Sub Category</Text>
                <DropDownPicker
                  open={subCategoryOpen}
                  value={subCategoryValue}
                  items={subCategoryItems}
                  setOpen={setSubCategoryOpen}
                  setValue={setSubCategoryValue}
                  setItems={setSubCategoryItems}
                  style={styles.dropdown}
                  placeholder="Select the Sub Category"
                  dropDownContainerStyle={styles.dropdownContainer}
                />

                <Text style={styles.label}>Dealer/Stockiest</Text>
                <DropDownPicker
                  open={dealerOpen}
                  value={dealerValue}
                  items={dealerItems}
                  setOpen={setDealerOpen}
                  setValue={setDealerValue}
                  setItems={setDealerItems}
                  style={styles.dropdown}
                  placeholder="Select Dealer/Stockiest"
                  dropDownContainerStyle={styles.dropdownContainer}
                />

                <Text style={styles.label}>Additional Items</Text>
                <DropDownPicker
                  open={additionalItemsOpen}
                  value={additionalItemsValue}
                  items={additionalItems}
                  setOpen={setAdditionalItemsOpen}
                  setValue={setAdditionalItemsValue}
                  setItems={setAdditionalItems}
                  style={styles.dropdown}
                  placeholder="Select Additional Items"
                  dropDownContainerStyle={styles.dropdownContainer}
                />

                <Text style={styles.label}>Location</Text>

                <TouchableOpacity
                  onPress={requestLocationPermission}
                  style={styles.locationButton}>
                  <Text style={styles.locationButtonText}>Get Location</Text>
                </TouchableOpacity>
                {locationString && (
                  <Text style={styles.locationText}>{locationString}</Text>
                )}

                {location && (
                  <View style={styles.locationContainer}>
                    <Text style={styles.locationLabel}>Latitude:</Text>
                    <Text style={styles.locationValue}>
                      {location.latitude}
                    </Text>
                    <Text style={styles.locationLabel}>Longitude:</Text>
                    <Text style={styles.locationValue}>
                      {location.longitude}
                    </Text>
                  </View>
                )}

                <Text style={styles.label}>Images</Text>
                <TouchableOpacity
                  onPress={handleImageSelection}
                  style={styles.imageButton}>
                  <Text style={styles.imageButtonText}>Select Image</Text>
                </TouchableOpacity>

                <View style={styles.selectedImagesContainer}>
                  {selectedImages.map((imageUrl, idx) => (
                    <View key={idx} style={styles.imageWrapper}>
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.selectedImage}
                        resizeMode="cover" // Optional: To control image resizing
                      />
                      <TouchableOpacity
                        onPress={() => handleRemoveImage(idx)}
                        style={styles.removeButton}>
                        <Text style={styles.removeButtonText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                <View style={styles.navigationButtons}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setIsDetailedForm(false)}>
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </>
            )
          }
        />
      </KeyboardAvoidingView>
      {loading && <Loader message="Submitting your form..." />}
    </SafeAreaView>
  );
};

export default AddNewForm;