# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

### Firebase Schema

#### Ingredients
ingredient_id: string
name: string
image: string

#### Foods
![Note]Rating is the rating_sum/rating_count
food_id: string
pretty: string this can have duplicates just needs to be unique to the restuant
name: string
rating_sum: number is the sum of sum(Itams/Stars/rating)
rating_count: is the cound of count(Itams/Stars)
hearts: string[] contains the uid of the users that have heated the food
ingredients: string[] an array of ingrident_id 
image: string (the id of the image) ONLY jpg
date: number_Epoch
restaurant_id: string
category: string of type resturant category (see resturant categories)

#### Itams/Stars
![Note] when updating this run a transaction to also update rating_sum and rating_count.
uid: string
rating: number [1,5]

sum(rating)
count(Itams/Stars)

#### Resturants
restaurant_id (should be a uid)
pretty (something nice for url like Open_Kitchen)
name
image (the id of the image) ONLY jpg
restaurant_categories: string[] // This array can only have things add to this.

#### Users
uid
name
email
resturant_preference (resturant_id or "none")
