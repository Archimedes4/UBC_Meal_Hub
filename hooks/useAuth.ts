/*
  UBC_Menu_Hub
  Andrew Mainella
  This function will produce information on the current user. Data and is they are signed in. This function will be optimized always use it. TODO optimization
*/

import { auth } from "@/functions/firebase";
import { loadingStateEnum } from "@/types";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [loadingState, setLoadingState] = useState(loadingStateEnum.loading);

  useEffect(() => {
    // Check if the user is signed in
    // If they are, set the user and signedIn state
    // If they are not, set the user and signedIn state to null and false respectively
    const sub = onAuthStateChanged(auth, (data) => {
      if (data === null) {
        setSignedIn(false)
      } else {
        setUser(null); // TODO get user data
        setSignedIn(true);
      }
      setLoadingState(loadingStateEnum.success)
    })

    return () => sub();
  }, []);

  return { user, signedIn, loadingState };
}