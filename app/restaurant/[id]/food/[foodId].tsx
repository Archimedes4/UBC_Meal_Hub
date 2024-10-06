import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { ChevronLeft, HeartIcon, StarIcon } from '../../../../components/Icons';
import { foodStateEnum } from '@/types';
import LoadingScreen from '@/components/LoadingScreen';
import { getFoodPretty, setUserRating } from '@/functions/food';
import { router, useGlobalSearchParams } from 'expo-router';
import useAuth from '@/hooks/useAuth';

function StarComponent({rating, foodId, uid, hoverRating, setHoverRating}:{
  rating: number
  foodId: string;
  uid: string;
  hoverRating: number;
  setHoverRating: (rating: number) => void;
}) {
  const [isHover, setIsHover] = useState(false);

  async function loadRateFood() {
    // Rate the food
    const result = await setUserRating(foodId, uid, rating);
  }

  return (
    <Pressable
      onPress={() => {
        loadRateFood()
      }}
      onHoverIn={() => {setIsHover(true); setHoverRating(rating)}}
      onHoverOut={() => {setIsHover(false); setHoverRating(-1)}}
      onPressIn={() => {setIsHover(true); setHoverRating(rating)}}
      onPressOut={() => {setIsHover(false); setHoverRating(-1)}}
    >
      <StarIcon width={50} height={50} color={(isHover || hoverRating >= rating) ? 'white' : '#f6ff00'} />
    </Pressable>
  )
}

export default function FoodPage() {
  const [isFavorite, setIsFavorite] = useState(false);
  const foodImage = 'https://media.cnn.com/api/v1/images/stellar/prod/220428140436-04-classic-american-hamburgers.jpg?c=16x9&q=h_653,w_1160,c_fill/f_webp';
  const [food, setFood] = useState<food | null>(null);
  const [foodState, setFoodState] = useState<foodStateEnum>(foodStateEnum.loading);
  const [hoverRating, setHoverRating] = useState(-1);

  const {id, foodId} = useGlobalSearchParams()
  const {uid} = useAuth()
  const {width, height} = useWindowDimensions();

  async function loadFood() {
    if (typeof id !== 'string' || typeof foodId !== 'string') {
      return
    }
    const food = await getFoodPretty(foodId, id)
    if (food.result === foodStateEnum.success) {
      setFood(food.data)
      setFoodState(foodStateEnum.success)
    } else {
      setFoodState(food.result)
    }
  }

  useEffect(() => {
    loadFood()
  }, [])

  if (foodState === foodStateEnum.loading) {
    return <LoadingScreen />
  }

  if (foodState === foodStateEnum.notFound) {
    return (
      <View>
        <Text>Food Not Found</Text>
      </View>
    )
  }

  if (foodState === foodStateEnum.success && food !== null && typeof foodId === 'string') {
    return (
      <ScrollView style={styles.container}>
        <Pressable
          style={{position: 'absolute', zIndex: 2, backgroundColor: 'white', marginLeft: 15, marginTop: 15, borderRadius: 50, width: 50, height: 50}}
          onPress={() => {router.push("/")}}
        >
          <ChevronLeft width={50} height={50} style={{position: 'absolute', left: -2}}/>
        </Pressable>
        {/* Food Image */}
        <Image source={{ uri: foodImage }} style={{
          width: width,
          height: height * 0.3,
          resizeMode: 'cover',
        }} />

        {/* Food Name & Favorite Button */}
        <View style={styles.headerContainer}>
          <Text style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 15,
            fontSize: Math.min(width* 0.1, 56),
            color: "white",
            fontWeight: "bold",
          }}>{food.name}</Text>
          <Pressable onPress={() => {
              setIsFavorite(!isFavorite);
          }}>
            <HeartIcon width={45} height={45} color={"red"}/>
          </Pressable>
        </View>
        {/* Rating */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          marginBottom: 16,
          marginLeft: 15
        }}>
          {(food.rating_sum !== 0) && <Text style={{
            fontSize: 56,
            marginRight: 8,
            fontWeight: 'bold',
            color: "white"
          }} numberOfLines={1}>{Math.round(food.rating_count/food.rating_sum * 100)/100}</Text>}
          <View style={styles.starsContainer}>
            <StarComponent rating={1} foodId={food.food_id} uid={uid} hoverRating={hoverRating} setHoverRating={setHoverRating} />
            <StarComponent rating={2} foodId={food.food_id} uid={uid} hoverRating={hoverRating} setHoverRating={setHoverRating} />
            <StarComponent rating={3} foodId={food.food_id} uid={uid} hoverRating={hoverRating} setHoverRating={setHoverRating} />
            <StarComponent rating={4} foodId={food.food_id} uid={uid} hoverRating={hoverRating} setHoverRating={setHoverRating} />
            <StarComponent rating={5} foodId={food.food_id} uid={uid} hoverRating={hoverRating} setHoverRating={setHoverRating} />
          </View>
        </View>

        {/* Ingredients */}
        <Text style={{
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 8,
          color: 'white',
          marginLeft: 30
        }}>Ingredients</Text>
      </ScrollView>
    );
  }
  return (
    <View>
      <Text>Something Went Wrong</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#94C180', // Light green background
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  foodName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 24,
    marginRight: 8,
    fontWeight: 'bold',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ingredientsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  ingredientsList: {
    paddingHorizontal: 16,
  },
  ingredientItem: {
    fontSize: 18,
    marginVertical: 4,
  },
});