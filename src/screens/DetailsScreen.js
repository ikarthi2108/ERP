import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import styles from './DetailsScreenStyles';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  console.log(item);
  
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState('');

  const API_URL = 'https://krishna-a4lf.onrender.com/api/forms';

  const updateFormStatus = async (id, isAccepted, isRejected, reason = null) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/${id}/update-status`, {
        isAccepted,
        isRejected,
        reason,
      });
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const handleAccept = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to accept this item?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Accept',
          onPress: () => {
            updateFormStatus(item._id, true, false)
              .then(() => {
                Alert.alert('Success', 'Item accepted');
                navigation.navigate('AdminScreen'); // Navigate back to admin screen
              })
              .catch(() => {
                Alert.alert('Error', 'Failed to accept the item');
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleReject = () => {
    setModalVisible(true); // Show modal to capture rejection reason
  };

  const submitRejection = () => {
    if (reason.trim() === '') {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }

    updateFormStatus(item._id, false, true, reason)
      .then(() => {
        setModalVisible(false);
        Alert.alert('Success', 'Item rejected');
        navigation.navigate('AdminScreen'); // Navigate back to admin screen
      })
      .catch(() => {
        Alert.alert('Error', 'Failed to reject the item');
      });
  };

  const getStatusColor = () => {
    if (item.isAccepted) return '#ccead3'; // Green
    if (item.isRejected) return '#ce6c76'; // Red
    return '#dfd6ba'; // Yellow (Pending)
  };

  // Parse latitude and longitude from location string
  const [latitude, longitude] = item.location
    ? item.location.split(',').map((value) => value.trim())
    : ['N/A', 'N/A'];

  // Split createdTime into date and time
  const createdDateTime = item.createdTime ? new Date(item.createdTime) : null;
  const createdDate = createdDateTime ? createdDateTime.toLocaleDateString() : 'N/A';
  const createdTime = createdDateTime ? createdDateTime.toLocaleTimeString() : 'N/A';

  // Check if there are any images to display
  const hasImages = [
    item.img1, item.img2, item.img3, item.img4, item.img5,
    item.img6, item.img7, item.img8, item.img9, item.img10
  ].some(img => img);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Request ID:</Text>
      <Text style={styles.requestId}>{item.requestId}</Text>
      <Text style={styles.header}>Item Details</Text>
      <View style={[styles.detailContainer, { backgroundColor: getStatusColor() }]}>
        <View style={styles.detailRow}>
          <Icon name="business" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>Enterprise Name:</Text>
          <Text style={styles.value}>{item.enterpriseName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="person" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>Owner:</Text>
          <Text style={styles.value}>{item.ownerName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="location-on" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>Latitude:</Text>
          <Text style={styles.value}>{latitude}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="location-on" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>Longitude:</Text>
          <Text style={styles.value}>{longitude}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="home" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{item.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="location-city" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>City:</Text>
          <Text style={styles.value}>{item.city}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="pin-drop" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>Pincode:</Text>
          <Text style={styles.value}>{item.pincode}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="phone" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>Mobile No:</Text>
          <Text style={styles.value}>{item.mobileNo}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="email" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{item.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="receipt" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>GST No:</Text>
          <Text style={styles.value}>{item.gstNo}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="receipt" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>DTP No:</Text>
          <Text style={styles.value}>{item.dtpNo}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="receipt" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>Other Reg No:</Text>
          <Text style={styles.value}>{item.regNo}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="category" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{item.category}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="category" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>SubCategory:</Text>
          <Text style={styles.value}>{item.subCategory}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="store" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>Dealer Name:</Text>
          <Text style={styles.value}>{item.dealer}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="add-box" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>Additional Items:</Text>
          <Text style={styles.value}>{item.additionalItems}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="event" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>Created Date:</Text>
          <Text style={styles.value}>{createdDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="event" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>Created Time:</Text>
          <Text style={styles.value}>{createdTime}</Text>
        </View>
        
        {item.actionDate && item.actionTime && (
          <View style={styles.detailRow}>
            <Icon name="event" size={24} color="#444" style={styles.icon} />
            <Text style={styles.label}>Action Date & Time:</Text>
            <Text style={styles.value}>
              {item.actionDate} {item.actionTime}
            </Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Icon name="info" size={24} color="#444" style={styles.icon} />
          <Text style={styles.label}>Reason:</Text>
          <Text style={styles.value}>{item.reason || 'N/A'}</Text>
        </View>

        {/* Display images if they are not null or empty */}
        {hasImages && (
          <View style={styles.imageContainer}>
            {item.img1 && (
              <Image
                source={{ uri: item.img1 }}
                style={styles.image}
              />
            )}
            {item.img2 && (
              <Image
                source={{ uri: item.img2 }}
                style={styles.image}
              />
            )}
            {item.img3 && (
              <Image
                source={{ uri: item.img3 }}
                style={styles.image}
              />
            )}
            {item.img4 && (
              <Image
                source={{ uri: item.img4 }}
                style={styles.image}
              />
            )}
            {item.img5 && (
              <Image
                source={{ uri: item.img5 }}
                style={styles.image}
              />
            )}
            {item.img6 && (
              <Image
                source={{ uri: item.img6 }}
                style={styles.image}
              />
            )}
            {item.img7 && (
              <Image
                source={{ uri: item.img7 }}
                style={styles.image}
              />
            )}
            {item.img8 && (
              <Image
                source={{ uri: item.img8 }}
                style={styles.image}
              />
            )}
            {item.img9 && (
              <Image
                source={{ uri: item.img9 }}
                style={styles.image}
              />
            )}
            {item.img10 && (
              <Image
                source={{ uri: item.img10 }}
                style={styles.image}
              />
            )}
          </View>
        )}

        {!item.isAccepted && !item.isRejected && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={handleAccept}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Accept</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={handleReject}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Reject</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Status Button */}
      <View style={styles.statusButtonContainer}>
        <TouchableOpacity
          style={[styles.statusButton, { backgroundColor: getStatusColor() }]}
          disabled={true}>
          <Text style={styles.statusButtonText}>
            {item.isAccepted ? 'Accepted' : item.isRejected ? 'Rejected' : 'Pending'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal for rejection reason */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Enter Reason for Rejection</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter reason"
              value={reason}
              onChangeText={setReason}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.rejectButton]}
                onPress={submitRejection}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Submit</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.acceptButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default DetailScreen;