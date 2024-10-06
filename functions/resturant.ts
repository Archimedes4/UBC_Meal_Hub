import { loadingStateEnum, resturantStateEnum } from "@/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Gets a resturant given a pretty name
 */
export async function getResturantPretty(pretty: string): Promise<{
  result: resturantStateEnum.success,
  data: resturant
} | {
  result: resturantStateEnum.failed | resturantStateEnum.notFound
}> {
  try {
    const result = await getDocs(query(collection(db, "resturants"), where("pretty", "==", pretty)))
    if (result.docs.length === 1) {
      return {
        result: resturantStateEnum.success,
        data: result.docs[0].data() as resturant
      }
    }
    return {result: resturantStateEnum.notFound}
  } catch {
    return {result: resturantStateEnum.failed}
  }
}

export async function getResturants(): Promise<{
  result: loadingStateEnum.success,
  data: resturant[]
} | {
  result: loadingStateEnum.failed
}> {
  try {
    let resturants: resturant[] = []
    const result = await getDocs(collection(db, "resturants"))
    console.log(result.docs)
    for (let index = 0; index < result.docs.length; index++) {
      console.log(result.docs[index].data())
      resturants.push(result.docs[index].data() as resturant)
    }

    return {
      result: loadingStateEnum.success,
      data: resturants
    } 
  } catch {
    return {
      result: loadingStateEnum.failed
    }
  }
}