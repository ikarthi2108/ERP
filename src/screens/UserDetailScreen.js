import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const UserDetailScreen = ({ route }) => {
  const { item } = route.params;

  // Filter images that are not null or undefined
  const images = [item.img1, item.img2, item.img3, item.img4, item.img5, item.img6, item.img7, item.img8, item.img9, item.img10].filter(
    (image) => image
  );

  const renderImage = (imageUri, index) => (
    <Image key={index} source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Full Details</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Req ID:</Text>
        <Text style={styles.value}>{item.requestId || 'N/A'}</Text>

        <Text style={styles.label}>Enterprise Name:</Text>
        <Text style={styles.value}>{item.enterpriseName || 'N/A'}</Text>

        <Text style={styles.label}>Owner Name:</Text>
        <Text style={styles.value}>{item.ownerName || 'N/A'}</Text>

        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{item.address || 'N/A'}</Text>

        <Text style={styles.label}>City:</Text>
        <Text style={styles.value}>{item.city || 'N/A'}</Text>

        <Text style={styles.label}>Pincode:</Text>
        <Text style={styles.value}>{item.pincode || 'N/A'}</Text>

        <Text style={styles.label}>Mobile No:</Text>
        <Text style={styles.value}>{item.mobileNo || 'N/A'}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{item.email || 'N/A'}</Text>

        <Text style={styles.label}>GST No:</Text>
        <Text style={styles.value}>{item.gstNo || 'N/A'}</Text>

        <Text style={styles.label}>DTP No:</Text>
        <Text style={styles.value}>{item.dtpNo || 'N/A'}</Text>

        <Text style={styles.label}>Reg No:</Text>
        <Text style={styles.value}>{item.regNo || 'N/A'}</Text>

        <Text style={styles.label}>Category:</Text>
        <Text style={styles.value}>{item.category || 'N/A'}</Text>

        <Text style={styles.label}>Sub Category:</Text>
        <Text style={styles.value}>{item.subCategory || 'N/A'}</Text>

        <Text style={styles.label}>Dealer:</Text>
        <Text style={styles.value}>{item.dealer || 'N/A'}</Text>

        <Text style={styles.label}>Additional Items:</Text>
        <Text style={styles.value}>{item.additionalItems || 'N/A'}</Text>

        <Text style={styles.label}>Created Date:</Text>
        <Text style={styles.value}>{item.createdDate || 'N/A'}</Text>

        <Text style={styles.label}>Created Time:</Text>
        <Text style={styles.value}>{item.createdTime || 'N/A'}</Text>
      </View>

      <Text style={styles.imageSectionTitle}>Images</Text>
      <View style={styles.imageContainer}>
        {images.length > 0 ? (
          images.map(renderImage)
        ) : (
          <Text style={styles.noImagesText}>No images found</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  imageSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  image: {
    width: (width - 60) / 2, // Adjusting width for two images per row with spacing
    height: 150,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    marginBottom: 15,
  },
  noImagesText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    width: '100%',
    marginTop: 20,
  },
});

export default UserDetailScreen;
