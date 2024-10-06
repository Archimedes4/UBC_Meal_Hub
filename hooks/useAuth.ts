/*
  UBC_Menu_Hub
  Andrew Mainella
  This function will produce information on the current user. Data and is they are signed in. This function will be optimized always use it. TODO optimization
*/

import { auth, db } from "@/functions/firebase";
import { authStateEnum, loadingStateEnum } from "@/types";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState<user | null>(null);
  const [authState, setAuthState] = useState(authStateEnum.loading);
  const [uid, setUid] = useState<string>("")

  useEffect(() => {
    // Check if the user is signed in
    // If they are, set the user and signedIn state
    // If they are not, set the user and signedIn state to null and false respectively
    const sub = onAuthStateChanged(auth, (data) => {
      if (data === null) {
        setAuthState(authStateEnum.noAuth)
      } else {
        console.log(data.uid)
        setUid(data.uid)
        setUser(null); // TODO get user data
      }
    })
    return () => sub();
  }, []);

  // User sub
  useEffect(() => {
    if (uid === "") return;
    const sub = onSnapshot(doc(db, "users", uid), (doc) => {
      setAuthState(authStateEnum.loading)
      console.log("Here", uid)
      if (doc.exists()) {
        console.log("DATA", doc.data())
        setUser(doc.data() as user)
        setAuthState(authStateEnum.signedIn)
      } else {
        console.log("User does not exist");
        setAuthState(authStateEnum.noAccount)
      }
    })
    return () => sub();
  }, [uid])

  return { user, authState, uid };
}