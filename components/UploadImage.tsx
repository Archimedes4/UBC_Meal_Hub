import React, { useState } from 'react';
import { View, Text, Image, Alert, ActivityIndicator, Modal, TouchableOpacity, StyleSheet, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from './Supabase'; // Replace with your supabase client configuration

export default function UploadImageScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Function to pick an image from the user's library using expo-image-picker
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1, // Adjust image quality (1 is highest quality)
    });

    if (!result.canceled && result.assets?.[0].uri) {
      setImageUri(result.assets[0].uri);
      setModalVisible(true); // Show the modal once the image is selected
    } else {
      console.log('User cancelled image picker');
    }
  };

  // Function to upload the image to Supabase storage
  const uploadImage = async () => {
    if (!imageUri) return;

    try {
      setUploading(true);
      const fileName = `${Date.now()}-image.jpg`;

      const response = await fetch(imageUri);
      const blob = await response.blob();

      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, blob);

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(data.path);

      if (!publicUrlData.publicUrl) {
        throw new Error('Failed to generate public URL');
      }

      setImageUri(publicUrlData.publicUrl);
      Alert.alert('Image uploaded successfully!', 'Image URL: ' + publicUrlData.publicUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error.message);
      Alert.alert('Error', 'Could not upload image');
    } finally {
      setUploading(false);
      setModalVisible(false); // Hide the modal after upload
    }
  };

  return (
    <>
      {/* Modal for Image Preview and Upload */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Image Preview */}
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={{ width: 200, height: 200, marginBottom: 20 }}
            />
          )}

          {/* Styled Upload Button */}
          <TouchableOpacity
            style={[styles.uploadButton, uploading && styles.buttonDisabled]}
            onPress={uploadImage}
            disabled={uploading}
          >
            <Text style={styles.buttonText}>{uploading ? 'Uploading...' : 'Upload Image'}</Text>
          </TouchableOpacity>

          {/* Loading Spinner */}
          {uploading && <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />}
        </View>
      </Modal>

      {/* Button to Pick Image */}
      <Button title="Pick and Upload Image" onPress={pickImage} />
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background effect
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 15,
    elevation: 5, // For a shadow effect
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
});
