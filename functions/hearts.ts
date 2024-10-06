import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { loadingStateEnum } from "@/types";

export async function addHeart(foodId: string) {
  const uid = auth.currentUser?.uid
  if (uid === undefined) {
    return loadingStateEnum.failed
  }
  try {
    await updateDoc(doc(db, "foods", foodId), {
      hearts: arrayUnion(uid)
    })
    return loadingStateEnum.success
  } catch {
    return loadingStateEnum.failed
  }
}

export async function removeHeart(foodId: string) {
  const uid = auth.currentUser?.uid
  if (uid === undefined) {
    return loadingStateEnum.failed
  }
  try {
    await updateDoc(doc(db, "foods", foodId), {
      hearts: arrayRemove(uid)
    })
    return loadingStateEnum.success
  } catch {
    return loadingStateEnum.failed
  }
}