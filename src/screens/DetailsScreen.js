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

const DetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState('');

  const BASE_URL = 'http://13.127.69.100:5000/api/forms'; 

  const updateFormStatus = async (id, isAccepted, isRejected, reason = null) => {
    try {
      setLoading(true);
      const response = await axios.put(`${BASE_URL}/${id}/update-status`, {
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Request ID:</Text>
      <Text style={styles.requestId}>{item.requestId}</Text>
      <Text style={styles.header}>Item Details</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Enterprise Name:</Text>
        <Text style={styles.value}>{item.enterpriseName}</Text>
        <Text style={styles.label}>Owner:</Text>
        <Text style={styles.value}>{item.ownerName}</Text>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{item.address}</Text>
        <Text style={styles.label}>City:</Text>
        <Text style={styles.value}>{item.city}</Text>
        <Text style={styles.label}>Pincode:</Text>
        <Text style={styles.value}>{item.pincode}</Text>
        <Text style={styles.label}>Mobile No:</Text>
        <Text style={styles.value}>{item.mobileNo}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{item.email}</Text>
        <Text style={styles.label}>GST No:</Text>
        <Text style={styles.value}>{item.gstNo}</Text>
        <Text style={styles.label}>DTP No:</Text>
        <Text style={styles.value}>{item.dtpNo}</Text>
        <Text style={styles.label}>Other Reg No:</Text>
        <Text style={styles.value}>{item.regNo}</Text>
        <Text style={styles.label}>Category:</Text>
        <Text style={styles.value}>{item.category}</Text>
        <Text style={styles.label}>SubCategory:</Text>
        <Text style={styles.value}>{item.subCategory}</Text>
        <Text style={styles.label}>Dealer Name:</Text>
        <Text style={styles.value}>{item.dealer}</Text>
        <Text style={styles.label}>Additional Items:</Text>
        <Text style={styles.value}>{item.additionalItems}</Text>
        <Text style={styles.label}>Created Date & Time:</Text>
        <Text style={styles.value}>
          {item.createdDate} {item.createdTime}
        </Text>

        {item.actionDate && item.actionTime && (
          <>
            <Text style={styles.label}>Action Date & Time:</Text>
            <Text style={styles.value}>
              {item.actionDate} {item.actionTime}
            </Text>
          </>
        )}

        <Text style={styles.label}>Reason:</Text>
        <Text style={styles.value}>{item.reason || 'N/A'}</Text>

        {item.img1 && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${item.img1}` }}
            style={styles.image}
          />
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
