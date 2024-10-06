import { View, Text, ActivityIndicator, useWindowDimensions } from 'react-native'
import React from 'react'
import { colors } from '@/types';

export default function LoadingScreen() {
  const {width, height} = useWindowDimensions();
  return (
    <View style={{width, height, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="white"/>
      <Text style={{marginTop: 5, color: "white", fontWeight: 'bold', fontSize: 25}}>Loading...</Text>
    </View>
  )
}