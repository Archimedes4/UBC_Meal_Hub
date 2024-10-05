import { View, Text, useWindowDimensions, Pressable } from 'react-native'
import React, { useState } from 'react'
import AppleAuthenticationButton from '@/components/AppleAuthenticationButton';
import GoogleAuthenticationButton from '@/components/GoogleAuthenticationButton';

export default function signIn() {
  const {width, height} = useWindowDimensions();
  const [continueAlt, setContinueAlt] = useState(false);
  return (
    <View style={{width, height, backgroundColor: "#ADEE8F"}}>
      <View style={{margin: 'auto'}}>
        <Text style={{fontFamily: "PorterSansBlock", fontSize: 50}}>UBC Menu Hub</Text>
        <View style={{width: Math.min(500, width), marginHorizontal: 'auto'}}>
          <View style={{marginVertical: 15}}>
            <AppleAuthenticationButton/>
          </View>
          <GoogleAuthenticationButton />
          <Pressable style={{
            backgroundColor: "white",
            borderRadius: 45,
            borderWidth: 2,
            padding: 15
          }}
            onHoverIn={() => setContinueAlt(true)}
            onHoverOut={() => setContinueAlt(false)}
            onPress={() => {
              console.log("Continue as guest");
            }}
          >
            <Text style={{textAlign: 'center', fontWeight: 'bold'}}>CONTINUE AS GUEST</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}