import { View, Text, useWindowDimensions, ScrollView, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useGlobalSearchParams } from 'expo-router'
import { Image } from 'expo-image';
import { loadingStateEnum, resturantStateEnum } from '@/types';
import LoadingScreen from '@/components/LoadingScreen';
import { getResturantPretty } from '@/functions/resturant';
import { ChevronLeft } from '@/components/Icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { getFoodsByCategory } from '@/functions/food';
import FoodComponent from '@/components/FoodComponent';
import useNumColumns from '@/hooks/useNumColumns';
import generateUUID from '@/functions/generateUUID';

function ResturantFoods({
  resturant,
  category
}:{
  resturant: resturant;
  category: string
}) {
  const [foods, setFoods] = useState<food[]>([])
  const [state, setState] = useState<loadingStateEnum>(loadingStateEnum.loading)
  const {width} = useWindowDimensions()
  const numColumns = useNumColumns()

  async function loadFoods() {
    const result = await getFoodsByCategory(resturant.restaurant_id, category)
    if (result.result === loadingStateEnum.success) {
      setFoods(result.data)
      setState(loadingStateEnum.success)
    } else {
      setState(result.result)
    }
  }

  useEffect(() => {
    loadFoods()
  }, [category])

  if (state === loadingStateEnum.loading) {
    return <LoadingScreen />
  }
  
  if (state === loadingStateEnum.success) {
    return (
      <FlatList
        key={generateUUID()}
        data={foods}
        numColumns={numColumns}
        renderItem={({item}) => (
          <Pressable style={{marginBottom: 15}} onPress={() => {router.push(`/restaurant/${item.restaurant_id}/food/${item.pretty}`)}}>
            <FoodComponent food={item} width={((width - 15)/numColumns)} height={((width - 15)/numColumns - 15) * 0.8}/>
          </Pressable>
        )}
        keyExtractor={(item) => item.food_id}
        ListFooterComponent={() => (
          <View style={{height: 30}} />
        )}
      />
    )
  }
  return null
}

function CategoryBlock({
  category,
  setSelectedCategory
}:{
  category: string;
  setSelectedCategory: (category: string) => void
}) {
  const [isAlt, setIsAlt] = useState(false)
  return (
    <Pressable
      style={{margin: 5, backgroundColor: isAlt ? 'gray':'white', padding: 15, paddingHorizontal: 60, borderRadius: 45, borderWidth: 3}}
      onHoverIn={() => setIsAlt(true)}
      onHoverOut={() => setIsAlt(false)}
      onPressIn={() => setIsAlt(true)}
      onPressOut={() => setIsAlt(false)}
      onPress={() => setSelectedCategory(category)}
    >
      <Text selectable={false} style={{margin: 'auto', color: isAlt ? "white":"black", height: 20}}>{category}</Text>
    </Pressable>
  ) 
}

export default function RestaurantPage() {
  const {id} = useGlobalSearchParams()
  const {width, height} = useWindowDimensions()
  const [resturantState, setResturantState] = useState<resturantStateEnum>(resturantStateEnum.loading)
  const [resturant, setResturant] = useState<resturant | null>(null)
  const insets = useSafeAreaInsets()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  async function loadResturant() {
    try {
      if (typeof id !== "string") {
        setResturantState(resturantStateEnum.failed)
        return
      }
      // Load resturant
      const result = await getResturantPretty(id)
      if (result.result === resturantStateEnum.success) {
        setResturant(result.data)
        setResturantState(resturantStateEnum.success)
      } else {
        setResturantState(result.result)
      }
    } catch {
      setResturantState(resturantStateEnum.failed)
    }
  }

  useEffect(() => {
    loadResturant()
  }, [])

  if (resturantState === resturantStateEnum.loading) {
    return <LoadingScreen />
  }

  if (resturantState === resturantStateEnum.success && resturant !== null) {
    return (
      <View style={{width, height, backgroundColor: "#94c180"}}>
        <Pressable style={{position: 'absolute', margin: 15, zIndex: 2, backgroundColor: 'white', width: 50, height: 50, borderRadius: 25, top: insets.top}} onPress={() => router.push("/")}>
          <ChevronLeft width={50} height={50}  style={{position: 'absolute', left: -3}}/>
        </Pressable>
        <Image source={resturant.image} style={{width, height: height * 0.3}} />
        <View style={{width: width, height: height * 0.3, position: 'absolute', justifyContent: 'center', alignItems: 'center'}}>
          <BlurView intensity={10} style={{width: width * 0.8, alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 45, overflow: 'hidden'}}>
            <Text style={{fontSize: 55, fontWeight: 'bold', color: "white"}}>{resturant.name}</Text>
          </BlurView>
        </View>
        {(resturant.restaurant_categories.length === 1 && resturant.restaurant_categories[0] === "Main") ? null:(
          <View style={{height: 60}}>
            <ScrollView style={{width, height: 60, backgroundColor: '#94c180', overflow: 'hidden'}} horizontal>
              {resturant.restaurant_categories.map((category) => (
                <CategoryBlock key={category} category={category} setSelectedCategory={setSelectedCategory}/>
              ))}
            </ScrollView>
          </View>)}
        <ResturantFoods resturant={resturant} category={selectedCategory} />
      </View>
    )
  }

  if (resturantState === resturantStateEnum.notFound) {
    return (
      <View>
        <Text>Restaurant not found</Text>
      </View>
    )
  }

  return (
    <View>
      <Text>Something went wrong</Text>
    </View>
  )
}