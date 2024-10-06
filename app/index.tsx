// UBC Meal Hub
// Home page
// Quy Duong Nguyen
import { Image, StyleSheet, Platform, View, useWindowDimensions, Text, Pressable, FlatList, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { getFoods } from '@/functions/food';
import { authStateEnum, colors, loadingStateEnum } from '@/types';
import FoodComponent from '@/components/FoodComponent';
import { getGreeting } from '@/functions/getGreeting';
import useNumColumns from '@/hooks/useNumColumns';
import Head from 'expo-router/head'
import ResturantComponent from '@/components/ResturantComponent';
import { getResturants } from '@/functions/resturant';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UserImage from '@/components/UserImage';
import useAuth from '@/hooks/useAuth';
import LoadingScreen from '@/components/LoadingScreen';
import { ChevronDown, ChevronUp } from '@/components/Icons';

function SearchComponent({onChange}:{onChange: (text: string) => void}) {
  const [searchQuery, setSearchQuery] = useState('');
  const {width} = useWindowDimensions()

  useEffect(() => {
    const interval = setTimeout(() => {
      onChange(searchQuery)
    }, 500)
    return () => {
      clearInterval(interval)
    }
  }, [searchQuery])

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
          color: "black"
        }}
        placeholderTextColor={'black'}
      />
    </View>
  )
}

enum homeScreenModeEnum {
  both,
  food,
  resturant
}

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets()
  const [homeScreenMode, setHomeScreenMode] = useState(homeScreenModeEnum.both)
  const {authState, user} = useAuth();
  const [searchText, setSearchText] = useState("")
  const [isShowingMore, setIsShowingMore] = useState(false)

  if (authState === authStateEnum.loading) {
    return <LoadingScreen />
  }

  return (
    <>
      <Head>
        <title>UBC Menu Hub</title>
      </Head>
      <View style={{width, height}}>
        {/* top part */} 
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center', 
            justifyContent: 'space-between',
            width,
            height: height * 0.1 + insets.top,
            backgroundColor: colors.secondary,
            paddingTop: insets.top,
            paddingHorizontal: 15
          }}
        >
          <View style={{marginVertical: 'auto'}}>
            <Text style={{fontSize: 20, marginBottom: 2, marginVertical: 'auto', fontWeight: (authState === authStateEnum.signedIn && user !== null) ? 'regular':"bold"}}>{getGreeting()}{(authState === authStateEnum.signedIn && user !== null) ? ",":""}</Text>
            {(authState === authStateEnum.signedIn && user !== null) && (<Text style={{fontSize: 25, fontWeight: 'bold'}}>{user.firstName} {user.lastName}</Text> )}
          </View>
          <Pressable onPress={() => {
            router.push("/account")
          }} style={{borderRadius: 100, overflow: 'hidden'}}>
            <UserImage index={user?.profileImage ?? 0} style={{width: 50, height: 50, borderRadius: 25}} length={60}/>
          </Pressable>
        </View>
        <View
          style={{
            backgroundColor:colors.primary,
            width,
            height: height * 0.9,
          }}
        >
          <SearchComponent onChange={(e) => {
            setSearchText(e)
          }}/>
          <ScrollView style={{height: (height * 0.9) - (insets.top + insets.bottom + 60), width}}>
            {(homeScreenMode !== homeScreenModeEnum.resturant) && (
              <FoodMenu isShowingMore={isShowingMore} setIsShowingMore={setIsShowingMore} search={searchText}/>
            )}
            {(homeScreenMode !== homeScreenModeEnum.resturant) && (
              <View>
                <Text style={{marginLeft: 15, marginVertical: 5, fontWeight: 'bold', fontSize: 25}}>Resturants</Text>
                <ResturantMenu search={searchText}/>
              </View>
            )}
            <View style={{height: insets.bottom * 2}}/>
          </ScrollView>
        </View>
      </View>
    </>
  );
}

function FoodMenu({
  search,
  isShowingMore,
  setIsShowingMore
}:{
  search: string
  isShowingMore: boolean
  setIsShowingMore: (isShowingMore: boolean) => void
}) {
  const [foodState, setFoodState] = useState(loadingStateEnum.loading)
  const [foods, setFoods] = useState<food[]>([])
  const numColumns = useNumColumns()
  const {width, height} = useWindowDimensions()
  const insets = useSafeAreaInsets()

  async function loadFoods() {
    const result = await getFoods(search)
    setFoodState(result.result)
    if (result.result === loadingStateEnum.success) {
      console.log(result.data)
      setFoods(result.data)
    }
  }

  useEffect(() => {
    setFoodState(loadingStateEnum.loading)
    loadFoods()
  }, [search])

  function rows(arrIn: food[], num: number) {
    console.log(arrIn)
    let arr = [...arrIn]
    const newArr = [];
    while(arr.length) newArr.push(arr.splice(0,num));
    return newArr
  }

  if (foodState === loadingStateEnum.loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={"white"}/>
        <Text style={{textAlign: 'center', color: 'white', marginTop: 15}}>Loading...</Text>
      </View>
    )
  }

  if (foods.length === 0) {
    return null
  }

  return (
    <View>
      <Text style={{marginLeft: 15, marginVertical: 5, fontWeight: 'bold', fontSize: 25}}>Foods</Text>
      {rows([...foods].slice(0, (isShowingMore) ? foods.length:(numColumns * 2)), numColumns).map((row) => (
        <View style={{flexDirection: 'row', marginBottom: 15}}>
          {row.map((food) => (
            <Pressable onPress={() => router.push(`/restaurant/${food.restaurant_id}/food/${food.pretty}`)}>
              <FoodComponent food={food} width={(width - 15)/numColumns} height={(width/numColumns) * 0.8}/>
            </Pressable>
          ))}
        </View>
      ))}
      {isShowingMore ?
        <Pressable style={{flexDirection: 'row', marginHorizontal: 'auto'}} onPress={() => setIsShowingMore(false)}>
          <ChevronUp width={25} height={25}/>
          <Text style={{marginVertical: 'auto'}}>Show Less</Text>
        </Pressable>:
        <Pressable style={{flexDirection: 'row', marginHorizontal: 'auto'}} onPress={() => setIsShowingMore(true)}>
          <ChevronDown width={25} height={25}/>
          <Text style={{marginVertical: 'auto'}}>Show More</Text>
        </Pressable>
      }
    </View>
  )
}


function ResturantMenu({
  search
}:{
  search: string
}) {
  const [resturantState, setResturantState] = useState(loadingStateEnum.loading)
  const [resturants, setResturants] = useState<resturant[]>([])
  const numColumns = useNumColumns()
  const {width} = useWindowDimensions()

  async function loadResturants() {
    const result = await getResturants(search)
    setResturantState(result.result)
    console.log(result, search)
    if (result.result === loadingStateEnum.success) {
      setResturants(result.data)
    }
  }

  useEffect(() => {
    setResturantState(loadingStateEnum.loading)
    loadResturants()
  }, [search])

  function rows(arrIn: resturant[], num: number) {
    let arr = [...arrIn]
    const newArr = [];
    while(arr.length) newArr.push(arr.splice(0,num));
    return newArr
  }

  if (resturantState === loadingStateEnum.loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={"white"}/>
        <Text style={{textAlign: 'center', color: 'white', marginTop: 15}}>Loading...</Text>
      </View>
    )
  }

  return (
    <>
    {rows(resturants, numColumns).map((row) => (
      <View style={{flexDirection: 'row'}}>
        {row.map((food) => (
          //@ts-expect-error
          <Pressable style={{marginLeft: 15, marginBottom: 15}} onPress={() => {router.push(`restaurant/${food.pretty}`)}}>
            <ResturantComponent resturant={food} width={((width - 15)/numColumns) -15} height={(width/numColumns) * 0.8}/>
          </Pressable>
        ))}
      </View>
    ))}
  </>
  )
}