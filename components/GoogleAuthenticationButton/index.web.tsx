import { GoogleLogin } from "@react-oauth/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../functions/firebase"
import React from "react";

export default function GoogleAuthenticationButton() {
  return (
    <GoogleLogin
      onSuccess={async credentialResponse => {
        const googleCredential = GoogleAuthProvider.credential(credentialResponse.credential);
        await signInWithCredential(auth, googleCredential);
      }}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  )
}