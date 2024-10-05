export enum loadingStateEnum {
  loading,
  failed,
  success
}

export enum authStateEnum {
  loading,
  signedIn,
  noAuth
}

type ingredient = {
  ingredient_id: string;
  name: string;
  image: string;
}

type food = {
  food_id: string;
  name: string;
  rating_sum: number;
  rating_count: number;
  hearts: string[]; // uids of users that have hearted
  ingredients: string[]; // uids of the ingredients
  image: string;
  date: number; // The time of the item in expo
  restaurant_id: string;
  category: string; // This is the catgory that the corrsponding resturant has.
}

type resturant = {
  restaurant_id: string
  pretty: string
  name: string
  image: string
  restaurant_categories: string[]
}