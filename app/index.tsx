// UBC Meal Hub
// Home page
// Quy Duong Nguyen
import { Image, StyleSheet, Platform, View, useWindowDimensions, Text, Pressable, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { getFoods } from '@/functions/food';
import { loadingStateEnum } from '@/types';
import FoodComponent from '@/components/FoodComponent';
import { getGreeting } from '@/functions/getGreeting';
import useNumColumns from '@/hooks/useNumColumns';
import Head from 'expo-router/head'
import ResturantComponent from '@/components/ResturantComponent';
import { getResturants } from '@/functions/resturant';

function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const {width} = useWindowDimensions()
  return (
    <View
      style={{
        flexDirection: 'row', // Arrange the icon and TextInput in a row
        alignItems: 'center', // Vertically align the icon and TextInput
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 10,
        height: 60, // Adjust height of the search bar container
        width: width - 30, // Adjust width for the full search bar container
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3, // Add shadow for better visual separation
        margin: 15
      }}
    >
      {/* Conditionally render the search icon */}
      {searchQuery.length < 20 && ( // Hide icon when input is long
        <Image
          source={require('@/assets/images/search icon.png')}
          style={{
            width: 40,
            height: 40,
            marginRight: 5, // Add spacing between the icon and TextInput
          }}
        />
      )}
      <TextInput
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          flex: 1, // Make the TextInput take up remaining space
          fontSize: 18, // Adjust font size
          height: '100%', // Ensure TextInput takes the full height of its container
          paddingVertical: 0, // Remove vertical padding to align the text properly
          ...(Platform.OS === 'web' && {
            outlineStyle: 'none', // Web-specific property to hide the outline
          }),
        }}
      />
    </View>
  )
}

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();

  return (
    <>
      <Head>
        <title>UBC Menu Hub</title>
      </Head>
      <View>
        {/* top part */} 
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: 16, 
            width,
            height: height * 0.1,
            backgroundColor: "#CAE9BB"
          }}
        >
          <View> 
            <Text style={{fontSize: 20, marginBottom: 2}}>{getGreeting()}</Text>
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>Andrew Mainella</Text> 
          </View>
          <Pressable onPress={() => {
            router.push("/account")
          }}>
            <Image
              source={require('@/assets/images/homelander.png')}
              style={{width: 50, height: 50, borderRadius: 25}}
            />
          </Pressable>
        </View>
        <View
          style={{
            backgroundColor: '#94C180',
            width,
            height: height * 0.9,
          }}
        >
          <SearchComponent />
          <Text style={{marginLeft: 15, marginVertical: 5, fontWeight: 'bold', fontSize: 25}}>Foods</Text>
          <FoodMenu />
          <Text style={{marginLeft: 15, marginVertical: 5, fontWeight: 'bold', fontSize: 25}}>Resturants</Text>
          <ResturantMenu />
        </View>
      </View>
    </>
  );
}

function FoodMenu() {
  const [foodState, setFoodState] = useState(loadingStateEnum.loading)
  const [foods, setFoods] = useState<food[]>([])
  const numColumns = useNumColumns()
  const {width} = useWindowDimensions()

  async function loadFoods() {
    const result = await getFoods()
    setFoodState(result.result)
    if (result.result === loadingStateEnum.success) {
      setFoods(result.data)
    }
  }

  useEffect(() => {
    loadFoods()
  }, [])

  if (foodState === loadingStateEnum.loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={"white"}/>
        <Text style={{textAlign: 'center', color: 'white', marginTop: 15}}>Loading...</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={foods}
      numColumns={numColumns}
      renderItem={(food) => (
        <FoodComponent food={food.item} width={(width - 15)/numColumns} height={(width/numColumns) * 0.8}/>
      )}
      style={{paddingRight: 15}}
    />
  )
}


function ResturantMenu() {
  const [resturantState, setResturantState] = useState(loadingStateEnum.loading)
  const [resturants, setResturants] = useState<resturant[]>([])
  const numColumns = useNumColumns()
  const {width} = useWindowDimensions()

  async function loadFoods() {
    const result = await getResturants()
    setResturantState(result.result)
    if (result.result === loadingStateEnum.success) {
      setResturants(result.data)
    }
  }

  useEffect(() => {
    loadFoods()
  }, [])

  if (resturantState === loadingStateEnum.loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={"white"}/>
        <Text style={{textAlign: 'center', color: 'white', marginTop: 15}}>Loading...</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={resturants}
      numColumns={numColumns}
      style={{paddingRight: 15}}
      renderItem={(food) => (
        <View style={{marginLeft: 15, marginBottom: 15}}>
          <ResturantComponent resturant={food.item} width={((width - 15)/numColumns) -15} height={(width/numColumns) * 0.8}/>
        </View>
      )}
    />
  )
}