// UBC Meal Hub
// Home page
// Quy Duong Nguyen
import { Image, StyleSheet, Platform, View, useWindowDimensions } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { Text } from 'react-native';

export default function HomeScreen() {
  const {width, height} = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <View>
  {/* top part */} 
    <View style={{flexDirection: 'row', alignItems: 'center', 
                  justifyContent: 'space-between', padding: 16, 
                  width, height: height * 0.1, backgroundColor: "#CAE9BB"}}>
      <View> 
        <Text> Good Morning, Andrew Mainella
          </Text>
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
      <View
    style={{
      flexDirection: 'row', // Arrange the icon and TextInput in a row
      alignItems: 'center', // Vertically align the icon and TextInput
      backgroundColor: 'white',
      borderRadius: 20,
      paddingHorizontal: 10,
      height: 60, // Adjust height of the search bar container
      width: 240, // Adjust width for the full search bar container
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 3, // Add shadow for better visual separation
    }}
  >
    <Image
      source={require('@/assets/images/search icon.png')}
      style={{
        flex: 1,
        width: 20,
        height: 20,
        marginRight: 5, // Add spacing between the icon and TextInput
      }}
    />
    <TextInput
      placeholder="Search"
      value={searchQuery}
      onChangeText={setSearchQuery}
      style={{
        flex: 1, // Make the TextInput take up remaining space
        fontSize: 18, // Adjust font size
        height: '100%', // Ensure TextInput takes the full height of its container
        paddingVertical: 0, // Remove vertical padding to align the text properly
      }}
    />
  </View>
    </View>
    </View>
  )
}
