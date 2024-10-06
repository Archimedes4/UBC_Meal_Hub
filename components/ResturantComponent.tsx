import { View, Text } from "react-native";
import {Image} from 'expo-image'
import { BlurView } from "expo-blur";
import React from "react";

export default function ResturantComponent({
  width,
  height,
  resturant
}:{
  width: number;
  height: number;
  resturant: resturant
}) {
  return (
    <View style={{borderRadius: 5, overflow: 'hidden', width, height}}>
      <Image source={{uri: resturant.image !== "" ? resturant.image:'https://media.cnn.com/api/v1/images/stellar/prod/220428140436-04-classic-american-hamburgers.jpg?c=original'}} style={{width: width, height: height}}/>
      <BlurView intensity={100} style={{
        position: 'absolute',
        bottom: 0,
        width: width,
        height: 35
      }}>
        <Text style={{marginVertical: 'auto', marginLeft: 5}}>{resturant.name}</Text>
      </BlurView>
    </View>
  )
}