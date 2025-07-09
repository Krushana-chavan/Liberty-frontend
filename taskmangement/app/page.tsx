"use client"
import AuthPage from "@/components/auth-page"
import Dashboard from "@/components/dashboard"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import type { Task, User as UserType } from "@/types/task"

// Mock data
const mockUsers: UserType[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com" },
  { id: "4", name: "Sarah Wilson", email: "sarah@example.com" },
]

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Project Review Meeting",
    company: "Acme Corp",
    type: "Meeting",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    color: "Blue",
    notes: "Quarterly project review with stakeholders",
    ownerId: "1",
    assignees: ["2", "3"],
    workflowStatus: "In Progress",
    completionStatus: "Pending",
    isRecurring: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Complete Documentation",
    company: "Tech Solutions",
    type: "Task",
    date: new Date().toISOString().split("T")[0],
    time: "14:00",
    color: "Green",
    notes: "Finalize API documentation for v2.0",
    ownerId: "1",
    assignees: [],
    workflowStatus: "Accepted",
    completionStatus: "Pending",
    isRecurring: false,
    createdAt: new Date().toISOString(),
  },
]

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
