import { View, Text, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalSearchParams } from 'expo-router'
import { Image } from 'expo-image';
import { loadingStateEnum, resturantStateEnum } from '@/types';
import LoadingScreen from '@/components/LoadingScreen';
import { getResturantPretty } from '@/functions/resturant';

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
        <Image source={require('@/assets/images/homelander.png')} style={{width, height: height * 0.3}} />
        <Text>Restaurant</Text>
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