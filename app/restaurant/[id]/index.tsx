import { View, Text, useWindowDimensions, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useGlobalSearchParams } from 'expo-router'
import { Image } from 'expo-image';
import { loadingStateEnum, resturantStateEnum } from '@/types';
import LoadingScreen from '@/components/LoadingScreen';
import { getResturantPretty } from '@/functions/resturant';
import { ChevronLeft } from '@/components/Icons';

function CategoryBlock({
  category
}:{
  category: string
}) {
  const [isAlt, setIsAlt] = useState(false)
  return (
    <Pressable
      style={{margin: 5, backgroundColor: isAlt ? 'gray':'white', padding: 15, paddingHorizontal: 60, borderRadius: 45, borderWidth: 3}}
      onHoverIn={() => setIsAlt(true)}
      onHoverOut={() => setIsAlt(false)}
      onPressIn={() => setIsAlt(true)}
      onPressOut={() => setIsAlt(false)}
    >
      <Text selectable={false} style={{margin: 'auto', color: isAlt ? "white":"black"}}>{category}</Text>
    </Pressable>
  ) 
}

export default function RestaurantPage() {
  const {id} = useGlobalSearchParams()
  const {width, height} = useWindowDimensions()
  const [resturantState, setResturantState] = useState<resturantStateEnum>(resturantStateEnum.loading)
  const [resturant, setResturant] = useState<resturant | null>(null)

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
        <Pressable style={{position: 'absolute', margin: 15, zIndex: 2, backgroundColor: 'white', width: 50, height: 50, borderRadius: 25}} onPress={() => router.push("/")}>
          <ChevronLeft width={50} height={50}  style={{position: 'absolute', left: -3}}/>
        </Pressable>
        <Image source={resturant.image} style={{width, height: height * 0.3}} />
        <View style={{height: 60}}>
          <ScrollView style={{width, height: 60, backgroundColor: '#94c180', overflow: 'hidden'}} horizontal>
            {resturant.restaurant_categories.map((category) => (
              <CategoryBlock key={category} category={category} />
            ))}
          </ScrollView>
        </View>
        <Text>{resturant.name}</Text>
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