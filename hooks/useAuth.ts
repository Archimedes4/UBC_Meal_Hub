/*
  UBC_Menu_Hub
  Andrew Mainella
  This function will produce information on the current user. Data and is they are signed in. This function will be optimized always use it. TODO optimization
*/

import { auth } from "@/functions/firebase";
import { authStateEnum, loadingStateEnum } from "@/types";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [authState, setAuthState] = useState(authStateEnum.loading);
  const [uid, setUid] = useState<string>("")

  useEffect(() => {
    // Check if the user is signed in
    // If they are, set the user and signedIn state
    // If they are not, set the user and signedIn state to null and false respectively
    const sub = onAuthStateChanged(auth, (data) => {
      if (data === null) {
        console.log("No user signed in");
        setAuthState(authStateEnum.noAuth)
      } else {
        setUid(data.uid)
        setUser(null); // TODO get user data
        setAuthState(authStateEnum.signedIn)
      }
    })

    return () => sub();
  }, []);

  return { user, authState, uid };
}