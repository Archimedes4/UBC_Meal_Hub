import { View, Text } from 'react-native'
import React from 'react'
import {Image} from 'expo-image'

export default function FoodComponent({
  food,
  width,
  height
}:{
  food: food;
  width: number;
  height: number
}) {
  return (
    <View style={{width, height}}>
      <Image source={{uri: food.image}} style={{width, height: height * 0.8}}/>
      <View style={{width, height: height * 0.2, flexDirection: 'row', justifyContent: 'space-between', padding: 5}}>
        <Text>{food.name}</Text>
        <Text>{food.rating_sum/food.rating_count}</Text>
      </View>
    </View>
  )
}