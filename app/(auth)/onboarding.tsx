/*
Profile form
Quy Duong Nguyen
*/
import LoadingScreen from '@/components/LoadingScreen';
import UserImage from '@/components/UserImage';
import { auth, db } from '@/functions/firebase';
import useAuth from '@/hooks/useAuth';
import { authStateEnum, colors, loadingStateEnum } from '@/types';
import { Redirect } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView, Pressable, useWindowDimensions } from 'react-native';


function ProfileIcon({index, setIndex, selectedIndex}:{index: number; setIndex: (index: number) => void, selectedIndex: number}) {
  const {width} = useWindowDimensions()
  const BOX = 120
  if (selectedIndex === index) {
    return (
      <Pressable onPress={() => {setIndex(index)}} style={{borderRadius: 100, overflow: 'hidden', borderWidth: 5, width: (width <= 576) ? BOX:150, height: (width <= 576) ? BOX:150, marginHorizontal: 'auto', justifyContent: 'center', marginVertical: 'auto'}}>
        <UserImage index={index} length={(width <= 576) ? (BOX * 0.93):140}/>
      </Pressable>
    )
  }
  return (
    <Pressable onPress={() => {setIndex(index)}} style={{borderRadius: 100, overflow: 'hidden', width: (width <= 576) ? BOX:150, height: (width <= 576) ? BOX:150, marginHorizontal: 'auto', justifyContent: 'center', marginVertical: 'auto'}}>
      <UserImage index={index} length={(width <= 576) ? BOX:150} style={{width: (width <= 576) ? (BOX * 0.8):120, height: (width <= 576) ? (BOX * 0.8):120}} viewStyle={{width: 150, height: 150}}/>
    </Pressable>
  )
}

export default function ProfileForm() {
  // Form states for user details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<number>(3);
  const {width} = useWindowDimensions()
  const [submitState, setSubmitState] = useState<loadingStateEnum>(loadingStateEnum.notStarted);
  const {authState} = useAuth();

  // Handle form submission
  async function handleSubmit() {
    const uid = auth.currentUser?.uid
    if (!firstName || !lastName || !email || selectedProfile === null || uid === undefined) {
      Alert.alert('Please fill out all fields');
      return;
    }

    // Save user details to database
    // ...
    try {
      await setDoc(doc(db, 'users', uid), {
        firstName,
        lastName,
        email,
        profileImage: selectedProfile,
      })
    } catch {
      Alert.alert('Something went wrong. Please try again.');
    }
  };

  if (authState === authStateEnum.loading) {
    return <LoadingScreen />
  }

  if (authState !== authStateEnum.noAccount) {
    return <Redirect href={'/account'}/>
  }

  return (
    <ScrollView contentContainerStyle={{
      flexGrow: 1,
      padding: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Text style={styles.title}>Complete Your Profile</Text>

      {/* First Name Input */}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor={'black'}
      />

      {/* Last Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor={'black'}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholderTextColor={'black'}
      />

      <Text style={styles.subtitle}>Choose 1 Picture</Text>

      {/* Image Selection Grid */}
      <View style={{flexDirection: 'row', width, marginVertical: 15, height: 160}}>
        <ProfileIcon index={0} setIndex={setSelectedProfile}  selectedIndex={selectedProfile} />
        <ProfileIcon index={1} setIndex={setSelectedProfile} selectedIndex={selectedProfile} />
        <ProfileIcon index={2} setIndex={setSelectedProfile} selectedIndex={selectedProfile} />
      </View>
      <View style={{flexDirection: 'row', width, marginVertical: 15, height: 160}}>
        <ProfileIcon index={3} setIndex={setSelectedProfile} selectedIndex={selectedProfile} />
        <ProfileIcon index={4} setIndex={setSelectedProfile} selectedIndex={selectedProfile} />
        <ProfileIcon index={5} setIndex={setSelectedProfile} selectedIndex={selectedProfile} />
      </View>

      {/* Submit Button */}
      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Save Profile</Text>
      </Pressable>
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
