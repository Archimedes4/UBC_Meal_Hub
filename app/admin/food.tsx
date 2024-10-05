import React, { useState } from 'react';
import { View, TextInput, Button, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function AdminAddFoodScreen() {
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Function to handle adding food (could integrate backend API here)
  const handleAddFood = () => {
    if (foodName && imageUri) {
      // For now, log the data (can add the backend API call here)
      console.log('Food added:', {
        name: foodName,
        description: description,
        image: imageUri,
      });

      // Reset form after submission
      setFoodName('');
      setDescription('');
      setImageUri(null);
    } else {
      alert('Please enter the food name and select an image.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Food Item</Text>

      {/* Input for food name */}
      <TextInput
        placeholder="Food Name"
        value={foodName}
        onChangeText={setFoodName}
        style={styles.input}
      />

      {/* Input for description (optional) */}
      <TextInput
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]} // Higher input box for description
        multiline
      />

      {/* Button to pick an image */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>Select Image</Text>
      </TouchableOpacity>

      {/* Display the selected image */}
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      {/* Button to submit the food */}
      <Button title="Add Food" onPress={handleAddFood} />
    </View>
  );
}

// Styling for the page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  imagePicker: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    alignSelf: 'center',
  },
});

