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
import UserImage from '@/components/UserImage';
import { signOut } from 'firebase/auth';
import { auth } from '@/functions/firebase';
import { getFavoriteFoods } from '@/functions/food';
import useNumColumns from '@/hooks/useNumColumns';

function SelectResturantComponent({
  length
}:{
  length: number;
}) {
  const [resturantState, setResturantState] = useState<loadingStateEnum>(loadingStateEnum.loading)
  const [resturants, setResturants] = useState<resturant[]>([])
  const numColumns = useNumColumns()
  const {width} = useWindowDimensions()
  
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


  function rows(arrIn: resturant[], num: number) {
    let arr = [...arrIn]
    const newArr = [];
    while(arr.length) newArr.push(arr.splice(0,num));
    return newArr
  }


  return (
    <View style={{height: 200, width: width - 30}}>
      <ScrollView style={{marginTop: 1, height: 200, width: width - 30}}>
        <View style={{marginHorizontal: 'auto'}}>
          {rows(resturants, numColumns).map((row) => (
            <View style={{flexDirection: 'row', marginBottom: 15}}>
              {row.map(resturant => (
                <Pressable style={{marginHorizontal: 7.5}}>
                  <ResturantComponent resturant={resturant} width={length} height={length}/>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
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
  const {authState, user} = useAuth();
  const numColumns = useNumColumns()

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
      resturantDropHeight.value = withTiming(280);
      setIsResturantDropped(true)
    }
  }

  if (authState === authStateEnum.loading) {
    return <LoadingScreen />
  }

  if (authState === authStateEnum.noAccount) {
    return <Redirect href={'/onboarding'}/>
  }

  if (user === null) {
    return (
      <Redirect href={'/sign-in'}/>
    )
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
          <View style={{width: height * 0.3, height: height * 0.3, borderRadius: height * 0.3, marginLeft: collaped ? 'auto':25, marginHorizontal: collaped ? 'auto':0, overflow: 'hidden'}}>
            <UserImage index={user.profileImage} length={height * 0.3} />
          </View>
          <Text style={{fontSize: 35, fontWeight: 'bold', textAlign: collaped ? 'center':undefined, marginVertical: 'auto', marginLeft: collaped ? 0:25}}>{user.firstName} {user.lastName}</Text>
        </View>
        <View style={{height: 60, zIndex: 2, marginBottom: 15}}>
          <Animated.View style={[{
            width: width - 30,
            marginHorizontal: 15,
            backgroundColor: 'white',
            position: 'absolute',
            overflow: 'hidden'
          }, resturanDropStyle]}>
            <Pressable style={{padding: 15}} onPress={() => {dropToggleResturant()}}>
              <Text style={{fontSize: 25, fontWeight: 'bold'}}>Open Kitchen</Text>
            </Pressable>
            <SelectResturantComponent length={((width - 60)/numColumns - 15)}/>
          </Animated.View>
        </View>
        <PaymentDropdown />
        <Pressable
          style={{height: 60, width: width - 30, marginHorizontal: 15, backgroundColor: 'white', borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginTop: 15}}
          onPress={() => signOut(auth)}
        >
          <Text style={{fontSize: 25, fontWeight: 'bold'}}>Sign Out</Text>
        </Pressable>
        <FavouriteFoodComponent />
        <View style={{height: 15}}/>
      </ScrollView>
    </>
  )
}

function FavouriteFoodComponent() {
  const [state, setState] = useState<loadingStateEnum>(loadingStateEnum.loading)
  const [foods, setFoods] = useState<food[]>([])
  const {width}= useWindowDimensions()
  const numColumns = useNumColumns()

  async function loadFoods() {
    const result = await getFavoriteFoods()
    setState(result.result)
    if (result.result === loadingStateEnum.success) {
      setFoods(result.data)
    }
  }

  function rows(arrIn: food[], num: number) {
    let arr = [...arrIn]
    const newArr = [];
    while(arr.length) newArr.push(arr.splice(0,num));
    return newArr
  }

  useEffect(() => {
    loadFoods()
  }, [])

  if (state === loadingStateEnum.failed) {
    return <Text>Failed to load favourite foods</Text>
  }

  if (foods.length === 0) {
    return null
  }

  if (state === loadingStateEnum.success) {
    return (
      <View style={{width}}>
        <Text style={{marginLeft: 15, marginTop: 15, fontWeight: 'bold', fontSize: 25, marginBottom: 15}}>Favorite Foods</Text>
        {rows(foods, numColumns).map(row => (
          <View style={{flexDirection: 'row', paddingRight: 15}}>
            {row.map((food) => (
              <Pressable onPress={() => {
                router.push(`/restaurant/${food.restaurant_id}/food/${food.pretty}`)
              }}>
                <FoodComponent food={food} width={((width - 15)/numColumns) - 15} height={(((width - 15)/numColumns) - 15) * 0.8}/>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    )
  }

  return null
}