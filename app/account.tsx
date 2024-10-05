import { View, Text, useWindowDimensions, Pressable } from 'react-native'
import React, { useMemo } from 'react'
import { router } from 'expo-router';

export default function Account() {
  const {width, height} = useWindowDimensions();
  const collaped = useMemo(() => {
    return width < 500;
  }, [width])
  return (
    <View style={{width, height, backgroundColor: "#94C180"}}>
      <Pressable onPress={() => {router.push("/")}}>
        <Text>Back</Text>
      </Pressable>
      <View style={{flexDirection: collaped ? undefined:"row"}}>
        
        <Text>Andrew Mainella</Text>
      </View>
      <Pressable>
        <Text>Open Kitchen</Text>
      </Pressable>
      <Pressable>
        <Text>Meal Plan</Text>
      </Pressable>
      <Text>Favorite Foods</Text>
    </View>
  )
}