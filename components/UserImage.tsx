import {Image} from 'expo-image'
import React from 'react';
import { ImageStyle, View, ViewStyle } from 'react-native';

export default function UserImage({index, length, style, viewStyle}:{index: number, length: number, style?: ImageStyle, viewStyle?: ViewStyle}) {
  // Image selection state for selecting only one image
  const images: ImageData[] = [
      require('@/assets/images/apple.png'),
      require('@/assets/images/avacado.png'),
      require('@/assets/images/banana.png'),
      require('@/assets/images/grapes.png'),
      require('@/assets/images/lemon.png'),
      require('@/assets/images/orange.png')
  ];

  function getColor(i: number) {
    if (i === 0) return "#A7ABDD"
    if (i === 1) return "#FABC2A"
    if (i === 2) return "#CA3C25"
    if (i === 3) return "#DE0D92"
    if (i === 4) return "#2E2E3A"
    if (i === 5) return "#64E9EE"
    return "purple"
  }

  if (index < 0 || index > (images.length - 1)) {
    return null;
  }

  return (
    <View style={[viewStyle, {width: length, height: length, backgroundColor: getColor(index), alignItems: 'center', justifyContent: 'center'}]}>
      <Image source={images[index]} style={[{width: length - 20, height: length - 20}, style]}/>
    </View>
  )
}