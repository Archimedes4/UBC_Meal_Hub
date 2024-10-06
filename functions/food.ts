import { foodStateEnum, loadingStateEnum, resturantStateEnum } from "@/types";
import { collection, doc, getDoc, getDocs, increment, query, runTransaction, setDoc, where } from "firebase/firestore";
import { db } from "./firebase";
import { getResturantPretty } from "./resturant";

export async function getFoodPretty(pretty: string, resturantId: string): Promise<{
    result: foodStateEnum.success;
    data: food;
} | {
    result: foodStateEnum.failed | foodStateEnum.notFound;
}> {
  try {
    const resturant = await getResturantPretty(resturantId)
    if (resturant.result !== resturantStateEnum.success) {
      return {result: foodStateEnum.failed}
    }
    const result = await getDocs(query(collection(db, "foods"), where("pretty", "==", pretty), where("restaurant_id", "==", resturant.data.restaurant_id)))
    if (result.docs.length === 1) {
      return {
        result: foodStateEnum.success,
        data: result.docs[0].data() as food
      }
    }
    return {result: foodStateEnum.notFound}
  } catch {
    return {result: foodStateEnum.failed}
  }
}

export async function getUserRating(foodId: string, uid: string): Promise<{
  result: loadingStateEnum.success,
  data: number //Natural [1,5]
} | {
  result: loadingStateEnum.failed
}> {
  try {
    const result = await getDoc(doc(db, "foods", foodId, "ratings", uid))
    const data = result.data()
    if (data === undefined) {
      return {result: loadingStateEnum.success, data: 0}
    }
    return {
      result: loadingStateEnum.success,
      data: data.rating as number
    }
  } catch {
    return {result: loadingStateEnum.failed}
  }
}

export async function setUserRating(foodId: string, uid: string, rating: number): Promise<loadingStateEnum.success | loadingStateEnum.failed> {
  try {
    await runTransaction(db, async (transaction) => {
      const ratingDoc = await transaction.get(doc(db, "foods", foodId, "ratings", uid))
      if (ratingDoc.exists()) {
        const ratingData = ratingDoc.data()
        transaction.set(doc(db, "foods", foodId, "ratings", uid), {
          uid: uid,
          rating: rating
        })
        transaction.update(doc(db, "foods", foodId), {
          rating_sum: increment(rating),
          rating_count: increment(rating - ratingData.rating)
        })
      } 
    })
    return loadingStateEnum.success
  } catch {
    return loadingStateEnum.failed
  }
}

export async function getFoods(): Promise<{
  result: loadingStateEnum.success;
  data: food[];
} | {
  result: loadingStateEnum.failed
}> {
  try {
    let foods: food[] = []
    const result = await getDocs(collection(db, "foods"))
    result.forEach((doc) => {
      foods.push(doc.data() as food)
    })
    return {
      result: loadingStateEnum.success,
      data: foods
    }
  } catch {
    return {
      result: loadingStateEnum.failed
    }
  }
}

export async function getResturantFoods(resturant_id: string): Promise<{
  result: loadingStateEnum.success;
  data: food[];
} | {
  result: loadingStateEnum.failed
}> {
  try {
    let foods: food[] = []
    const result = await getDocs(query(collection(db, "foods"), where("restaurant_id", "==", resturant_id)))
    result.forEach((doc) => {
      foods.push(doc.data() as food)
    })
    return {
      result: loadingStateEnum.success,
      data: foods
    }
  } catch {
    return {
      result: loadingStateEnum.failed
    }
  }
}