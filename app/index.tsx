// UBC Meal Hub
// Home page
// Quy Duong Nguyen
import { Image, StyleSheet, Platform, View, useWindowDimensions } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { TextInput } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const {width, height} = useWindowDimensions();
  return (
    <View>
  {/* top part */} 
    <View style={{flexDirection: 'row', alignItems: 'center', 
                  justifyContent: 'space-between', padding: 16, 
                  width, height: height * 0.1, backgroundColor: "#CAE9BB"}}>
      <View> 
        <ThemedText type = "default">Good Morning,</ThemedText>
        <ThemedText type = "default">Andrew Mainella,</ThemedText> 
      </View>
      <Image
      source={require('@/assets/images/homelander.png')}
      style={{width: 50, height: 50, borderRadius: 25}}
      />
    </View>

    {/* Main content*/}
    <View
      style = {{backgroundColor: "#94C180", width, height: height * 0.9,
                justifyContent: 'center', alignItems: 'center'}}>
      {/* <TextInput
        placeholder = "Search"
        value = {searchQuery}
        onChangeText = {setSearchQuery}
      /> */}
    </View>


    </View>
  )
}
