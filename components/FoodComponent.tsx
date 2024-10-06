import { View, Text } from 'react-native'
import React from 'react'
import {Image} from 'expo-image'
import { BlurView } from 'expo-blur';

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
    <View style={{width: width - 15, height, borderRadius: 25, overflow: 'hidden', borderWidth: 3, borderColor: 'black', marginLeft: 15}}>
      <Image source={food.image} style={{width, height: height}}/>
      <BlurView style={{width, height: height * 0.2, flexDirection: 'row', justifyContent: 'space-between', padding: 5, position: 'absolute', bottom: 0}}>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>{food.name}</Text>
        {(food.rating_count !== 0) && <Text style={{fontWeight: 'bold'}}>{food.rating_sum/food.rating_count}</Text>}
      </BlurView>
    </View>
  )
}