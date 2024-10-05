/*
  UBC_Menu_Hub
  Andrew Mainella
*/
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode } from 'react';

export default function GoogleProvider({
  children
}:{
  children: ReactNode
}) {
  return (
    <GoogleOAuthProvider clientId='641900113874-hbpu0luijn9s3sfnpbcb7vfjm5orvttk.apps.googleusercontent.com' >
      {children}
    </GoogleOAuthProvider>
  )
}