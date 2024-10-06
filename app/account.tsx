import { View, Text, useWindowDimensions, Pressable, ScrollView, FlatList} from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { Redirect, router } from 'expo-router';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {Image} from 'expo-image'
import { authStateEnum, colors, loadingStateEnum } from '@/types';
import { getResturants } from '@/functions/resturant';
import ResturantComponent from '@/components/ResturantComponent';
import { ChevronLeft } from '@/components/Icons';
import Head from 'expo-router/head';
import FoodComponent from '@/components/FoodComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAuth from '@/hooks/useAuth';
import LoadingScreen from '@/components/LoadingScreen';

function SelectResturantComponent() {
  const [resturantState, setResturantState] = useState<loadingStateEnum>(loadingStateEnum.loading)
  const [resturants, setResturants] = useState<resturant[]>([])
  
  async function loadResturants() {
    // Fetch resturants from the backend
    const resturants = await getResturants()
    setResturantState(resturants.result)
    if (resturants.result === loadingStateEnum.success) {
      setResturants(resturants.data)
    }
  }

  useEffect(() => {
    loadResturants()
  }, [])

  return (
    <ScrollView style={{marginTop: 1}}>
      {resturants.map(resturant => (
        <Pressable style={{marginLeft: 15}}>
          <ResturantComponent resturant={resturant} width={200} height={200}/>
        </Pressable>
      ))}
    </ScrollView>
  )
}

function DropdownItem({
  text,
  selectedItem,
  onSelectItem
}:{
  text: string;
  selectedItem: string
  onSelectItem: (item: string) => void
}) {
  const [isHover, setIsHover] = useState(false);

  if (text === selectedItem) {
    return null
  }

  return (
    <Pressable
      style={{padding: 15, paddingVertical: 7.5, backgroundColor: isHover ? 'lightgrey':'white'}}
      onHoverIn={() => {setIsHover(true)}}
      onHoverOut={() => {setIsHover(false)}}
      onPressIn={() => {setIsHover(true)}}
      onPressOut={() => {setIsHover(false)}}
      onPress={() => {onSelectItem(text)}}
    >
      <Text style={{fontWeight: '600'}}>{text}</Text>
    </Pressable>
  )
}

function PaymentDropdown() {
  const {width} = useWindowDimensions();
  const paymentDropHeight = useSharedValue(60);
  const [isPaymentDropped, setIsPaymentDropped] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('Residence Meal Plan');
  const [contentHeight, setContentHeight] = useState(0);

  const paymentDropStyle = useAnimatedStyle(() => {
    return {
      height: paymentDropHeight.value,
      borderRadius: 6000/paymentDropHeight.value
    }
  })

  function dropTogglePayment() {
    if (isPaymentDropped) {
      paymentDropHeight.value = withTiming(60);
      setIsPaymentDropped(false)
    } else {
      paymentDropHeight.value = withTiming(contentHeight + 60);
      setIsPaymentDropped(true)
    }
  }

  return (
    <View>
      <Animated.View style={[{
        width: width - 30,
        marginHorizontal: 15,
        backgroundColor: 'white',
        overflow: 'hidden'
      }, paymentDropStyle]}>
        <Pressable style={{padding: 15}} onPress={() => {dropTogglePayment()}}>
          <Text style={{fontSize: 25, fontWeight: 'bold'}}>{selectedPayment}</Text>
        </Pressable>
        <View onLayout={(e) => {setContentHeight(e.nativeEvent.layout.height); console.log(e.nativeEvent.layout.height)}}>
          <DropdownItem text='Residence Meal Plan' onSelectItem={setSelectedPayment} selectedItem={selectedPayment}/>
          <DropdownItem text='UBCcard Value Plan'onSelectItem={setSelectedPayment} selectedItem={selectedPayment}/>
          <DropdownItem text='Departmental Food Plan'onSelectItem={setSelectedPayment} selectedItem={selectedPayment}/>
          <DropdownItem text='Carryover Plan' onSelectItem={setSelectedPayment} selectedItem={selectedPayment}/>
          <DropdownItem text='UBC Guest Cards' onSelectItem={setSelectedPayment} selectedItem={selectedPayment}/>
          <DropdownItem text='cash' onSelectItem={setSelectedPayment} selectedItem={selectedPayment}/>
          <DropdownItem text='debit' onSelectItem={setSelectedPayment} selectedItem={selectedPayment}/>
          <DropdownItem text='credit' onSelectItem={setSelectedPayment} selectedItem={selectedPayment}/>
        </View>
      </Animated.View>
    </View>
  )
}

export default function Account() {
  const {width, height} = useWindowDimensions();
  const collaped = useMemo(() => {
    return width < 576;
  }, [width])
  const resturantDropHeight = useSharedValue(60);
  const [isResturantDropped, setIsResturantDropped] = useState(false);
  const insets = useSafeAreaInsets()
  const {authState} = useAuth();

  const resturanDropStyle = useAnimatedStyle(() => {
    return {
      height: resturantDropHeight.value,
      borderRadius: 6000/resturantDropHeight.value
    }
  })

  function dropToggleResturant() {
    if (isResturantDropped) {
      resturantDropHeight.value = withTiming(60);
      setIsResturantDropped(false)
    } else {
      resturantDropHeight.value = withTiming(height);
      setIsResturantDropped(true)
    }
  }

  if (authState === authStateEnum.loading) {
    return <LoadingScreen />
  }

  if (authState === authStateEnum.noAccount) {
    return <Redirect href={'/onboarding'}/>
  }

  return (
    <>
      <Head>
        <title>Account | UBC Menu Hub</title>
      </Head>
      <ScrollView style={{width, height, backgroundColor: colors.primary}}>
        <Pressable onPress={() => {router.push("/")}} style={{position: 'absolute'}}>
          <ChevronLeft width={50} height={50} style={{position: 'absolute', margin: 5, top: insets.top}}/>
        </Pressable>
        <View style={{flexDirection: collaped ? undefined:"row", marginTop: height * 0.15, marginBottom: height * 0.05}}>
          <Image source={'https://media.cnn.com/api/v1/images/stellar/prod/220428140436-04-classic-american-hamburgers.jpg?c=original'} style={{width: height * 0.3, height: height * 0.3, borderRadius: height * 0.3, marginLeft: collaped ? 'auto':25, marginHorizontal: collaped ? 'auto':0}}/>
          <Text style={{fontSize: 35, fontWeight: 'bold', textAlign: collaped ? 'center':undefined, marginVertical: 'auto', marginLeft: collaped ? 0:25}}>Andrew Mainella</Text>
        </View>
        <View style={{height: 60, zIndex: 2, marginBottom: 15}}>
          <Animated.View style={[{
            width: width - 30,
            marginHorizontal: 15,
            backgroundColor: 'white',
            position: 'absolute'
          }, resturanDropStyle]}>
            <Pressable style={{padding: 15}} onPress={() => {dropToggleResturant()}}>
              <Text style={{fontSize: 25, fontWeight: 'bold'}}>Open Kitchen</Text>
            </Pressable>
            <SelectResturantComponent />
          </Animated.View>
        </View>
        <PaymentDropdown />
        <Text style={{marginLeft: 15, marginTop: 15, fontWeight: 'bold', fontSize: 25}}>Favorite Foods</Text>
        <FlatList
          data={[]}
          renderItem={(food) => (<FoodComponent food={food.item} width={100} height={100}/>)}
          horizontal
          style={{marginTop: 15}}
        />
      </ScrollView>
    </>
  )
}