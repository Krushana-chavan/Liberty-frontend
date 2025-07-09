export interface User {
  _id: string
  name: string
  email: string
  role: "admin" | "user"
}

export interface fetchUser {
 
    _id: string
  name: string
  email: string
}

export type TaskType = "Task" | "Meeting" | "Week-off"
export type TaskColor = "Red" | "Green" | "Blue" | "Yellow"
export type WorkflowStatus = "No Action" | "Accepted" | "In Progress" | "Done"
export type CompletionStatus = "Pending" | "Completed"
export type RecurringType = "Daily" | "Weekdays" | "Weekly" | "Monthly" | "Yearly"

export interface Task {
  _id: string
  userId: string
  title: string
  company: string
  type: TaskType
  date: string // YYYY-MM-DD format
  time: string // HH:MM format
  color: TaskColor
  notes?: string
  ownerId: string
  assignees: string[] // User IDs
  workflowStatus: WorkflowStatus
  completionStatus: CompletionStatus
  isRecurring: boolean
  recurringType?: RecurringType
  createdAt: string
  reminder:string
}
