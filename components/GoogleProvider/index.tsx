/*
  UBC_Menu_Hub
  Andrew Mainella
  Setting up google sign in with @react-native-google-signin/google-signin. This has been tested on iOS.
*/
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ReactNode, useEffect } from 'react';

export default function GoogleProvider({
  children
}:{
  children: ReactNode
}) {
  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: '641900113874-7m9f451q8h1ehqiselhcvea4ak0e56ea.apps.googleusercontent.com'
    });  
  }, [])
  return children
}