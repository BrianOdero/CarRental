import supabase from "@/DBconfig/supabaseClient"
import { Session, User } from "@supabase/supabase-js"
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"

type AuthProps = {
    user : User | null,
    session: Session | null,
    initialized ?: boolean,
    signOut?: () => void
}

export const AuthContext = createContext<Partial<AuthProps>>({})

export function useAuth () {
    return React.useContext(AuthContext)
}

export function AuthProvider ({children}: PropsWithChildren) {

    //initializiing the user and session states
    const [user , setUser ] = useState<User | null>()
    const [session , setSession ] = useState<Session | null>()
    const [initialized , setInitialized] = useState(false)

    //useEffect for listening on authentication state change
    useEffect(() => {
        const {data} = supabase.auth.onAuthStateChange(async(event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setInitialized(true)
        })
        return () => {
            data.subscription.unsubscribe()
        }
    },[])

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    const value = {
        user, session , initialized, signOut
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}