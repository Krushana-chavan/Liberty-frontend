"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/types/task"
import { apiRequest } from "@/lib/api"

interface AuthContextType {
  user: User | null
 
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => void

}

const AuthContext = createContext<AuthContextType | undefined>(undefined)



export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("taskflow_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("taskflow_user")
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
  
    const result = await apiRequest({
      url:"/auth/login",
      method:"POST",
      data:{email,password}
    })

    console.log(result)
    if (result?.user) {
      const { password: _, ...userData } =result.user
      setUser(userData)
      localStorage.setItem("taskflow_user", JSON.stringify(userData))
      return { success: true }
    }

    return { success: false, error: "Invalid email or password" }
  }

  const signUp = async (name: string, email: string, password: string) => {
    // Check if user already exists
   
    const newUser = {

      name,
      email,
      password,
    }

    // Add to mock database
const result = await apiRequest({
  url:'/auth/signup',
  method:'POST',
  data:newUser
})
    return { success: true }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("taskflow_user")
  }

 

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
