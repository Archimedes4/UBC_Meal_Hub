import { View, Text, useWindowDimensions, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import AppleAuthenticationButton from '@/components/AppleAuthenticationButton';
import GoogleAuthenticationButton from '@/components/GoogleAuthenticationButton';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '@/functions/firebase';
import useAuth from '@/hooks/useAuth';
import { authStateEnum, loadingStateEnum } from '@/types';
import { Redirect } from 'expo-router';
import LoadingScreen from '@/components/LoadingScreen';
import Head from 'expo-router/head';

export default function signIn() {
  const {width, height} = useWindowDimensions();
  const [continueAlt, setContinueAlt] = useState(false);
  const {authState} = useAuth();

  if (authState === authStateEnum.loading) {
    return (
      <LoadingScreen />
    )
  }

  if (authState === authStateEnum.signedIn) {
    return <Redirect href="/"/>
  }

  return (
    <>
      <Head>
        <title>Sign In | UBC Menu Hub</title>
      </Head>
      <View style={{width, height, backgroundColor: "#ADEE8F"}}>
        <View style={{margin: 'auto'}}>
          <Text style={{fontFamily: "PorterSansBlock", fontSize: 50}}>UBC Menu Hub</Text>
          <View style={{width: Math.min(500, width), marginHorizontal: 'auto'}}>
            <View style={{marginVertical: 15}}>
              <AppleAuthenticationButton/>
            </View>
            <GoogleAuthenticationButton />
            <Pressable style={{
              backgroundColor: continueAlt ? "gray":"white",
              borderRadius: 45,
              borderWidth: 2,
              padding: 15
            }}
              onHoverIn={() => setContinueAlt(true)}
              onHoverOut={() => setContinueAlt(false)}
              onPress={() => {
                console.log("Continue as guest");
                signInAnonymously(auth)
              }}
            >
              <Text style={{textAlign: 'center', fontWeight: 'bold'}}>CONTINUE AS GUEST</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  )
}