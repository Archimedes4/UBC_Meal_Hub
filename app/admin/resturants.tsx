import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/functions/firebase';
import generateUUID from '@/functions/generateUUID';
import { router } from 'expo-router';

export default function resturants() {
  const [categories, setCategories] = useState<string[]>([]);
  const [resturantName, setResturantName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [prettyName, setPrettyName] = useState("");

  async function createResturant() {
    try {
      await setDoc(doc(db, "resturants", resturantName), {
        restaurant_id: generateUUID(),
        pretty: prettyName,
        name: resturantName,
        image: "",
        restaurant_categories: categories
      })
    } catch {

    }
  }

  return (
    <View>
      <Pressable onPress={() => {router.push('/')}}>
        <Text>Back</Text>
      </Pressable>
      <Text>resturants</Text>
      <Text>Resturant Name</Text>
      <TextInput value={resturantName} onChangeText={setResturantName}/>
      <Text>Pretty Name</Text>
      <TextInput value={prettyName} onChangeText={setPrettyName}/>
      <Text>Category Name</Text>
      <TextInput value={newCategory} onChangeText={setNewCategory}/>
      <Pressable onPress={() => {
        setCategories([...categories, newCategory])
        setNewCategory("")
      }}>
        <Text>Add Category</Text>
      </Pressable>
      <Text>Categories</Text>
      {categories.map((category, index) => {
        return (
          <View key={index}>
            <Text>{category}</Text>
          </View>
        )
      })}
      <Pressable onPress={() => {createResturant()}}>
        <Text>Create Resturant</Text>
      </Pressable>
    </View>
  )
}