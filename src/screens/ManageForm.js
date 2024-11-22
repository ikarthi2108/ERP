import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import Loader from '../components/Loader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './ManageFormStyles';

const API_URL = 'https://krishna-a4lf.onrender.com/api/dropdownData';

const ManageForm = () => {
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [dealer, setDealer] = useState('');
  const [additionalItem, setAdditionalItem] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingField, setEditingField] = useState(null); // Track which field is being edited
  const [editingValue, setEditingValue] = useState(''); // Track the value of the field being edited
  const [loading, setLoading] = useState(false);
  const [dropdownData, setDropdownData] = useState([]);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const response = await axios.get(API_URL);
      setDropdownData(response.data);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editingId) {
        const response = await axios.put(`${API_URL}/${editingId}`, {
          category,
          subCategory,
          dealer,
          additionalItem,
        });
        if (response.status === 200) {
          Alert.alert('Success', 'Form updated successfully.');
        }
      } else {
        const response = await axios.post(API_URL, {
          category,
          subCategory,
          dealer,
          additionalItem,
        });
        if (response.status === 201) {
          Alert.alert('Success', 'Form submitted successfully.');
        }
      }

      setCategory('');
      setSubCategory('');
      setDealer('');
      setAdditionalItem('');
      setEditingId(null);
      fetchDropdownData();
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', 'Failed to submit form.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item, field) => {
    setEditingId(item._id);
    setEditingField(field);
    setEditingValue(item[field] || ''); // Ensure fallback for null/undefined values
  };

  const handleSaveEdit = async () => {
    if (!editingField || editingValue === '') {
      Alert.alert('Error', 'Invalid data.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.patch(`${API_URL}/${editingId}/field`, {
        field: editingField,
        value: editingValue,
      });

      if (response.status === 200) {
        Alert.alert('Success', `Field "${editingField}" updated successfully.`);
        fetchDropdownData();
        setEditingId(null);
        setEditingField(null);
        setEditingValue('');
      }
    } catch (error) {
      console.error('Error updating field:', error);
      Alert.alert('Error', 'Failed to update field.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, field) => {
    Alert.alert(
      'Confirm Clear',
      `Are you sure you want to clear the "${field}" field?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await axios.patch(`${API_URL}/${id}/field`, {
                field,
                value: ''  // Send an empty string to clear the field
              });
              if (response.status === 200) {
                Alert.alert('Success', `Field "${field}" cleared successfully.`);
                fetchDropdownData();
              }
            } catch (error) {
              console.error('Error clearing field:', error);
              Alert.alert('Error', 'Failed to clear field.');
            }
          },
        },
      ]
    );
  };
  

  const renderSection = (title, key) => (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      {dropdownData.map(item => (
        <View style={styles.itemContainer} key={item._id}>
          {editingId === item._id && editingField === key ? (
            <View style={styles.inlineEditContainer}>
              <TextInput
                style={styles.inlineEditInput}
                value={editingValue}
                onChangeText={setEditingValue}
                placeholder="Edit value"
              />
              <TouchableOpacity
                style={styles.inlineEditButton}
                onPress={handleSaveEdit}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.inlineEditCancelButton}
                onPress={() => {
                  setEditingId(null);
                  setEditingField(null);
                  setEditingValue('');
                }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.itemText}>{item[key] || 'No data'}</Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleEdit(item, key)}>
                  <Icon name="edit" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, styles.deleteButton]}
                  onPress={() => handleDelete(item._id, key)}>
                  <Icon name="delete" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>
          {editingId ? 'Edit Form' : 'Manage Forms'}
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter category"
            value={category}
            onChangeText={setCategory}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sub Category</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter sub category"
            value={subCategory}
            onChangeText={setSubCategory}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Dealer</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter dealer"
            value={dealer}
            onChangeText={setDealer}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Additional Items</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter additional item"
            value={additionalItem}
            onChangeText={setAdditionalItem}
          />
        </View>

        <Button
          title={editingId ? 'Update' : 'Submit'}
          onPress={handleSubmit}
        />
      </View>

      {renderSection('Category', 'category')}
      {renderSection('Sub Category', 'subCategory')}
      {renderSection('Dealer', 'dealer')}
      {renderSection('Additional Items', 'additionalItem')}

      {loading && <Loader message="Submitting form..." />}
    </ScrollView>
  );
};

export default ManageForm;
