import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import { HeartIcon } from '@/components/Icons';
import { StarIcon } from '@/components/Icons';

interface FoodPageProps {
  foodName: string;
  foodImage: string;
  rating: number;
  ingredients: string[];
}

export default function FoodPage({ foodName, foodImage, rating, ingredients }:FoodPageProps) {
  const [isFavorite, setIsFavorite] = useState(false);

   // Render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          width={24}
          height={24}
          color={i <= rating ? "yellow" : ''}
        />
      );
    }
    return stars;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Food Image */}
      <Image source={{ uri: foodImage }} style={styles.foodImage} />

      {/* Food Name & Favorite Button */}
      <View style={styles.headerContainer}>
        <Text style={styles.foodName}>{foodName}</Text>
        <HeartIcon width={15} height={15} color={''}/>
        <Pressable onPress={() => {
            setIsFavorite(!isFavorite);
        }}>
          <HeartIcon width={15} height={15} color={"red"}/>
        </Pressable>
      </View>

      {/* Rating */}
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        <View style={styles.starsContainer}>
          {renderStars(rating)}
        </View>
      </View>

      {/* Ingredients */}
      <Text style={styles.ingredientsTitle}>Ingredients</Text>
      <View style={styles.ingredientsList}>
        {ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredientItem}>
            • {ingredient}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d4ed91', // Light green background
  },
  foodImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
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