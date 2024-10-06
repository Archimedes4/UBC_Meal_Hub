export enum loadingStateEnum {
  loading,
  failed,
  success,
  notStarted
}

export enum authStateEnum {
  loading,
  signedIn,
  noAuth,
  noAccount
}

export enum resturantStateEnum {
  loading,
  failed,
  success,
  notFound
}

export enum foodStateEnum {
  loading,
  failed,
  success,
  notFound
}

declare global {
  type ingredient = {
    ingredient_id: string;
    name: string;
    image: string;
  }
  
  type food = {
    food_id: string;
    name: string;
    pretty: string;
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
  type user = {
    firstName: string
    lastName: string
    email: string
    home_place: string
    payment: string
    profileImage: number
  }
}

export enum colors{
  primary = "#94C180",
  secondary = "#CAE9BB"
}