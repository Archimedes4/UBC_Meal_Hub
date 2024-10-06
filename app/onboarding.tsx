/*
Profile form
Quy Duong Nguyen
*/
import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';

// Define the image data type
type ImageData = {
  id: string;
  uri: any; // If the image is imported using `require`, you can use the type `any` or `ImageSourcePropType`
};

export default function ProfileForm() {
  // Form states for user details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Image selection state for selecting only one image
  const images: ImageData[] = [
    { id: '1', uri: require('@/assets/images/beef pho.png') },
    { id: '2', uri: require('@/assets/images/butter chicken.png') },
    { id: '3', uri: require('@/assets/images/cheeseburger real.png') },
    { id: '4', uri: require('@/assets/images/chicken thigh.png') },
    { id: '5', uri: require('@/assets/images/dim sum.png') },
    { id: '6', uri: require('@/assets/images/pork chop.png') },
  ];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Handle image selection for a single image
  const handleSelectImage = (id: string) => {
    if (selectedImage === id) {
      // Deselect image if it's already selected
      setSelectedImage(null);
    } else {
      // Select the new image
      setSelectedImage(id);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (firstName && lastName && email && selectedImage) {
      Alert.alert('Profile Saved', `Name: ${firstName} ${lastName}\nEmail: ${email}\nSelected Image: ${selectedImage}`);
      // Here you can proceed to the next step or submit the data to a server
    } else {
      Alert.alert('Incomplete', 'Please fill in all fields and select an image.');
    }
  };

  // Render each image in the grid
  const renderImage = ({ item }: { item: ImageData }) => (
    <TouchableOpacity
      onPress={() => handleSelectImage(item.id)}
      style={[
        styles.imageContainer,
        selectedImage === item.id ? styles.selected : null, // Highlight the selected image
      ]}
    >
      <Image source={item.uri} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>

      {/* First Name Input */}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      {/* Last Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
      />

      <Text style={styles.subtitle}>Choose 1 Picture</Text>

      {/* Image Selection Grid */}
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(item) => item.id}
        numColumns={3} // Display 3 images per row
        style={styles.imageGrid}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#56c5ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f3f3f3',
    marginBottom: 15,
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageGrid: {
    width: '100%',
    marginBottom: 20,
  },
  imageContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: '#00FF00', // Highlight selected image with a green border
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: '#adee8f',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
