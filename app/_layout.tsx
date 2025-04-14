import { AuthProvider, useAuth } from "@/provider/AuthProvider";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {


  const InitialLayout = () => {
    const {session, initialized} = useAuth()
    const segments = useSegments();
    const router = useRouter();

    //use Effect for redirecting based on authentication status
    useEffect(() => {
      if(!initialized) return;

      const InAuthGroup = segments[0] === '(auth)' as any;

      //navigate to home page if authenticated
      if(session && !InAuthGroup){
        router.replace('homepage' as any)
      }

      //navigate to login if not authenticated
      else if(!session && InAuthGroup){
        router.replace('/')
      }
      
    }, [session,initialized])

    return <Slot/>
  }

  return (
    <GestureHandlerRootView>
      <AuthProvider>
        <InitialLayout/>
      </AuthProvider>
    </GestureHandlerRootView>
    
  )
}
