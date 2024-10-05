import { resturantStateEnum } from "@/types";
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