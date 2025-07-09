"use client"
import AuthPage from "@/components/auth-page"
import Dashboard from "@/components/dashboard"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import type { Task, User as UserType } from "@/types/task"


function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-lg animate-spin" />
          </div>
          <p className="text-slate-600">Loading TaskFlow...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return <Dashboard />
}

export default function TaskManagementApp() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
