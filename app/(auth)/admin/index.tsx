import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

export default function admin() {
  return (
    <View>
      <Text>admin</Text>
      <Pressable onPress={() => {router.push('/admin/resturants')}} style={{padding: 10}}>
        <Text>Resturants</Text>
      </Pressable>
    </View>
  )
}