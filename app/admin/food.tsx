import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Image, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { doc, setDoc } from 'firebase/firestore';
import generateUUID from '@/functions/generateUUID';
import { db } from '@/functions/firebase';
import { loadingStateEnum } from '@/types';
import { getResturants } from '@/functions/resturant';

function ResturantList({
  setSelectedResturant
}:{
  setSelectedResturant: (resturant: resturant) => void
}) {
  const [resturants, setResturants] = useState<resturant[]>([])

  async function loadResturants() {
    // Fetch resturants from the backend
    const resturants = await getResturants()
    console.log(resturants)
    if (resturants.result === loadingStateEnum.success) {
      setResturants(resturants.data)
    }
  }

  useEffect(() => {
    loadResturants()
  }, [])

  return (
    <View>
      <Text>Resturant List</Text>
      {resturants.map(resturant => (
        <Pressable key={resturant.restaurant_id} onPress={() => {
          setSelectedResturant(resturant)
        }}>
          <Text>{resturant.pretty}</Text>
        </Pressable>)
      )}
      <Text>Categories</Text>
    </View>
  )
}

export default function AdminAddFoodScreen() {
  const [foodName, setFoodName] = useState('');
  const [prettyName, setPrettyName] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedResturant, setSelectedResturant] = useState<resturant | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Function to handle adding food (could integrate backend API here)
  async function addFood() {
    if (foodName && imageUri) {
      // For now, log the data (can add the backend API call here)
      const id = generateUUID()
      await setDoc(doc(db, "foods", id), {
        food_id: id,
        pretty: prettyName,
        name: foodName,
        rating_sum: 0,
        rating_count: 0,
        hearts: [],
        ingredients: [],
        image: "",
        date: new Date().getTime(),
        restaurant_id: selectedResturant?.restaurant_id,
        category: selectedCategory
      })
      // Reset form after submission
      setFoodName('');
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

      <TextInput
        placeholder="Pretty Name"
        value={prettyName}
        onChangeText={setPrettyName}
        style={styles.input}
      />

      <ResturantList setSelectedResturant={(e) => {
        setSelectedResturant(e)
      }}/>

      {selectedResturant && (selectedResturant.restaurant_categories.map(category => (
        <Pressable onPress={() => {
          setSelectedCategory(category)
        }}>
          <Text>{category}</Text>
        </Pressable>
      )))}

      {/* Button to pick an image */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>Select Image</Text>
      </TouchableOpacity>

      {/* Display the selected image */}
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      {/* Button to submit the food */}
      {(selectedResturant !== null && selectedCategory !== "" && prettyName !== "") &&
       <Button title="Add Food" onPress={addFood} />
      }
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

