import { foodStateEnum, loadingStateEnum, resturantStateEnum } from "@/types";
import { collection, doc, getDoc, getDocs, increment, query, runTransaction, setDoc, where } from "firebase/firestore";
import { auth, db } from "./firebase";
import { getResturantPretty } from "./resturant";

export async function getFoodPretty(pretty: string, resturantId_pretty: string): Promise<{
    result: foodStateEnum.success;
    data: food;
} | {
    result: foodStateEnum.failed | foodStateEnum.notFound;
}> {
  try {
    if (pretty.length === 36) {
      return getFood(pretty)
    }
    let resturantId = resturantId_pretty
    if (resturantId.length !== 36) {
      const resturant = await getResturantPretty(resturantId_pretty)
      if (resturant.result !== resturantStateEnum.success) {
        return {result: foodStateEnum.failed}
      }
      resturantId = resturant.data.restaurant_id
    } 
    const result = await getDocs(query(collection(db, "foods"), where("pretty", "==", pretty), where("restaurant_id", "==", resturantId)))
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

export async function getFood(foodId: string): Promise<{
  result: foodStateEnum.success;
  data: food;
} | {
  result: foodStateEnum.failed | foodStateEnum.notFound;
}> {
  try {
    const result = await getDoc(doc(db, "foods", foodId))
    if (result.exists()) {
      return {
        result: foodStateEnum.success,
        data: result.data() as food
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
          rating_sum: increment(rating - ratingData.rating)
        })
      }  else {
        transaction.set(doc(db, "foods", foodId, "ratings", uid), {
          uid: uid,
          rating: rating
        })
        transaction.update(doc(db, "foods", foodId), {
          rating_sum: increment(rating),
          rating_count: increment(1)
        })
      }
    })
    return loadingStateEnum.success
  } catch {
    return loadingStateEnum.failed
  }
}

export async function getFoods(search?: string): Promise<{
  result: loadingStateEnum.success;
  data: food[];
} | {
  result: loadingStateEnum.failed
}> {
  try {
    let foods: food[] = []
    let q = query(collection(db, "foods"))
    if (search !== undefined && search !== "") {
      q = query(collection(db, "foods"), where("name", ">=", search))
    }
    const result = await getDocs(q)
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

export async function getFavoriteFoods(): Promise<{
  result: loadingStateEnum.success;
  data: food[];
} | {
  result: loadingStateEnum.failed
}> {
  const uid = auth.currentUser?.uid
  if (uid === undefined) {
    return {
      result: loadingStateEnum.failed
    }
  }
  try {
    let foods: food[] = []
    const result = await getDocs(query(collection(db, "foods"), where("hearts", "array-contains", uid)))
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