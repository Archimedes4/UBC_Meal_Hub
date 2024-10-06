 import { View, Text } from 'react-native'
 import React from 'react'
import useAuth from '@/hooks/useAuth'
import { authStateEnum } from '@/types'
import LoadingScreen from '@/components/LoadingScreen'
import { Redirect, Slot } from 'expo-router'
 
 export default function _layout() {
  const {authState} = useAuth()
  if (authState === authStateEnum.loading) {
    return <LoadingScreen />
  }

  return (
    <Slot />
  )
 }