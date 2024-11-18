// AddNewForm.js
import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Alert } from 'react-native'; 
import {useNavigation} from '@react-navigation/native';
import styles from './AddNewFormStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://ec2-3.110.107.139.ap-south-1.compute.amazonaws.com:5000/api/forms'; 


const AddNewForm = () => {
  const [isDetailedForm, setIsDetailedForm] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [categoryItems, setCategoryItems] = useState([
    {label: 'Electronics', value: 'electronics'},
    {label: 'Furniture', value: 'furniture'},
    {label: 'Clothing', value: 'clothing'},
  ]);

  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [subCategoryValue, setSubCategoryValue] = useState(null);
  const [subCategoryItems, setSubCategoryItems] = useState([
    {label: 'Mobile', value: 'mobile'},
    {label: 'Laptop', value: 'laptop'},
    {label: 'Tablet', value: 'tablet'},
  ]);

  const [dealerOpen, setDealerOpen] = useState(false);
  const [dealerValue, setDealerValue] = useState(null);
  const [dealerItems, setDealerItems] = useState([
    {label: 'Puma', value: 'puma'},
    {label: 'Nike', value: 'nike'},
    {label: 'Adidas', value: 'adidas'},
  ]);

  const [additionalItemsOpen, setAdditionalItemsOpen] = useState(false);
  const [additionalItemsValue, setAdditionalItemsValue] = useState(null);
  const [additionalItems, setAdditionalItems] = useState([
    {label: 'Accessories', value: 'accessories'},
    {label: 'Spare Parts', value: 'spare-parts'},
    {label: 'Batteries', value: 'batteries'},
  ]);

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
  const navigation = useNavigation();

  useEffect(() => {
    getUserData();
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

  const handleImageSelection = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      maxFiles: 1,
      compressImageQuality: 0.4,
      includeBase64: true,
    })
      .then(images => {
        if (images.length > 3) {
          console.log('You can select up to 3 images only.');
          return;
        }

        const base64Images = images.map(image => image.data);
        setSelectedImages(base64Images);
      })
      .catch(error => console.error('Error selecting images:', error));
  };


  const submitFormDataToAPI = async (formData) => {
    try {
      const response = await axios.post(API_URL, formData);
      console.log(response.data.message);
      return response.data;
    } catch (error) {
      console.error('Error submitting form data:', error);
      throw error;
    }
  };
  const handleSubmit = () => {
    console.log('User details on submit: ', { empId, userName, userRole });
  
    const requestId = Math.floor(10000 + Math.random() * 90000); // Generate random 5-digit number
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
      isPending: 1,
      isAccepted: 0,
      isRejected: 0,
      emp_id: empId,
      name: userName,
      role: userRole,
      reason: '', // If you don't have a reason, leave it as an empty string
    };
  
    submitFormDataToAPI(formData)
      .then(() => {
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
          { cancelable: false } // Prevent closing alert without action
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
      })
      .catch(error => console.error('Error submitting form data:', error));
  };
  
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonContainer}>
          <Icon name="chevron-back" size={30} color="#fff" />
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
                },
              ],
            },
            {
              type: 'text',
              placeholder: 'Mobile No',
              value: mobileNo,
              setter: setMobileNo,
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
            },
            {
              type: 'text',
              placeholder: 'DTP No',
              value: dtpNo,
              setter: setDtpNo,
            },
            {
              type: 'text',
              placeholder: 'Other Reg NO',
              value: regNo,
              setter: setRegNo,
            },
          ]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            if (item.type === 'text') {
              return (
                <TextInput
                  placeholder={item.placeholder}
                  style={styles.input}
                  value={item.value}
                  onChangeText={item.setter}
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

                <Text style={styles.label}>Images</Text>
                <TouchableOpacity
                  onPress={handleImageSelection}
                  style={styles.imageButton}>
                  <Text style={styles.imageButtonText}>
                    Select Image
                  </Text>
                </TouchableOpacity>

                <View style={styles.selectedImagesContainer}>
                  {selectedImages.map((image, idx) => (
                    <Image
                      key={idx}
                      source={{uri: `data:image/png;base64,${image}`}}
                      style={styles.selectedImage}
                      resizeMode="cover" // Optional: To control image resizing
                    />
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
    </SafeAreaView>
  );
};

export default AddNewForm;
