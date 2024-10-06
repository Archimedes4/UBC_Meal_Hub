import { GoogleLogin } from "@react-oauth/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../functions/firebase"
import React from "react";
import { useWindowDimensions } from "react-native";

export default function GoogleAuthenticationButton() {
  const {width} = useWindowDimensions()
  return (
    <GoogleLogin
      onSuccess={async credentialResponse => {
        const googleCredential = GoogleAuthProvider.credential(credentialResponse.credential);
        await signInWithCredential(auth, googleCredential);
      }}
      onError={() => {
        console.log('Login Failed');
      }}
      width={Math.min(500, width - 30)}
    />
  )
}