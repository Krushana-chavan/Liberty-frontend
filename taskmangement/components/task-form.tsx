"use client"

import React from "react"

import { useState, useEffect, } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Users, Calendar, Palette, FileText, Repeat, Sparkles } from "lucide-react"
import type { Task, User, TaskType, TaskColor, WorkflowStatus, fetchUser, ReminderType } from "@/types/task"
import { apiRequest } from "@/lib/api"

interface TaskFormProps {
  task?: Task | null
  users: User[]
  currentUser: User
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void
  onClose: () => void
}

const TaskForm: React.FC<TaskFormProps> = ({ task, currentUser, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    ownerId: currentUser._id,
    title: "",
    company: "",
    type: "Task" as TaskType,
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    color: "Blue" as TaskColor,
    notes: "",
    assignees: [] as string[], // Initialize as empty array
    workflowStatus: "No Action" as WorkflowStatus,
    completionStatus: "Pending" as "Pending" | "Completed",
    isRecurring: false,
    recurringType: "Daily" as "Daily" | "Weekdays" | "Weekly" | "Monthly" | "Yearly",
    reminder: "1d"
  })

  const [availableUsers,setAvailableUsers] = useState<fetchUser>()
  console.log(task)
  useEffect(() => {
    if (task) {
      setFormData({
        ownerId: task.userId,
        title: task.title,
        company: task.company,
        type: task.type,
        date: task.date,
        time: task.time,
        color: task.color,
        notes: task.notes || "",
        assignees: task.assignees,
        workflowStatus: task.workflowStatus,
        completionStatus: task.completionStatus,
        isRecurring: task.isRecurring,
        recurringType: task.recurringType || "Daily",
        reminder: task.reminder
      })
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log("formData",formData)
    onSubmit({
      ...formData,
      ownerId: currentUser._id,
      _id: task ? task._id :'', // Use existing ID if editing
      userId: currentUser._id, // Ensure userId is set to current user's ID
      reminder: formData.reminder || "None", // Default to 1 day if not set
      workflowStatus: formData.workflowStatus || "No Action", // Default to "No Action" if not set
    })
  }

const toggleAssignee = (userId: string) => {
  console.log(userId)
  // First: clone the current assignees array
  const assigneesCopy = [...formData.assignees];

  // Then: check if the userId is already present
  const index = assigneesCopy.indexOf(userId);

  if (index !== -1) {
    // Remove userId
    assigneesCopy.splice(index, 1);
  } else {
    // Add userId
    assigneesCopy.push(userId);
  }

  // Finally: update the formData state once
  setFormData({
    ...formData,
    assignees: assigneesCopy,
  });
};



const isAdmin = currentUser.role === "admin"


const getAllUser = async () => {
  const result = await apiRequest({
    url: "/user/alluser",
    method: 'GET'
  });

  if (isAdmin) {
    setAvailableUsers(result); // show all users
  } else {
    // Filter only the current user
    const currentUserOnly = result.filter((user: any) => user._id === currentUser._id);
    setAvailableUsers(currentUserOnly);
  }
};


  useEffect(()=>{
    getAllUser()
  },[])
  // const availableUsers = useMemo(() => users.filter((user) => user.id !== currentUser.id), [users, currentUser.id])

  const colorOptions = [
    { value: "Red", color: "bg-red-500", label: "Red" },
    { value: "Green", color: "bg-emerald-500", label: "Green" },
    { value: "Blue", color: "bg-blue-500", label: "Blue" },
    { value: "Yellow", color: "bg-amber-500", label: "Yellow" },
  ]

  return (
    <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border shadow-xl">
      <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">{task ? "Edit Task" : "Create New Task"}</CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                {task ? "Update your task details" : "Add a new task to your workflow"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/50">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-slate-700">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-slate-700">
                  Task Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                  
                  className="h-12 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  placeholder="Enter task title..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium text-slate-700">
                  Company/Project
                </Label>
                <Input
                  id="company"
                  
                  value={formData.company}
                  onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                  className="h-12 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  placeholder="Enter company or project..."
                />
              </div>
            </div>
          </div>

          {/* Task Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-semibold text-slate-700">Task Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium text-slate-700">
                  Type
                </Label>
                <Select
                  value={formData.type}
               
                  onValueChange={(value: TaskType) => setFormData((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="h-12 bg-white/50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Task">📋 Task</SelectItem>
                    <SelectItem value="Meeting">🤝 Meeting</SelectItem>
                    <SelectItem value="Week-off">🏖️ Week-off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium text-slate-700">
                  Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  required
                  className="h-12 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium text-slate-700">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                 
                  value={formData.time}
                  onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                  className="h-12 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Color Theme
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                     
                      onClick={() => setFormData((prev) => ({ ...prev, color: option.value as TaskColor }))}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${formData.color === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 bg-white/50 hover:border-slate-300"
                        }`}
                    >
                      <div className={`w-4 h-4 ${option.color} rounded-full shadow-sm`} />
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
  <Label htmlFor="status" className="text-sm font-medium text-slate-700">
    Workflow Status
  </Label>
  <Select
    value={formData.workflowStatus || "No Action"}
    onValueChange={(value: WorkflowStatus) =>
      setFormData((prev) => ({ ...prev, workflowStatus: value }))
    }
  >
    <SelectTrigger className="h-12 bg-white/50 border-slate-200">
      <SelectValue placeholder="Select workflow status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="No Action">⏸️ No Action</SelectItem>
      <SelectItem value="Accepted">✅ Accepted</SelectItem>
      <SelectItem value="In Progress">🔄 In Progress</SelectItem>
      <SelectItem value="Done">✨ Done</SelectItem>
    </SelectContent>
  </Select>
</div>

              <div className="space-y-2">
               
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-pink-500" />
                  Reminder
                </Label>
                <div className="space-y-2">
                  <Label htmlFor="reminder" className="text-sm font-medium text-slate-700">
                    Notify me before
                  </Label>
                  <Select
                    value={formData.reminder || "1d"}
                    onValueChange={(value:ReminderType) => setFormData((prev) => ({ ...prev, reminder: value  }))}
                  >
                    <SelectTrigger className="h-12 bg-white/50 border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">🚫 No Reminder</SelectItem>
                      <SelectItem value="5m">⏰ 5 minutes before</SelectItem>
                      <SelectItem value="10m">⏰ 10 minutes before</SelectItem>
                      <SelectItem value="15m">⏰ 15 minutes before</SelectItem>
                      <SelectItem value="30m">⏰ 30 minutes before</SelectItem>
                      <SelectItem value="1h">🕐 1 hour before</SelectItem>
                      <SelectItem value="1d">📅 1 day before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
              Notes & Description
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={4}
              className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
              placeholder="Add any additional notes or description..."
            />
          </div>

          {/* Task Assignment */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-slate-700">
                {formData.type === "Meeting" ? "Meeting Participants" : "Task Assignment"}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(availableUsers) && availableUsers.map((user: User) => (
                  <div
                    key={user._id}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${formData.assignees.includes(user._id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white/50 hover:border-slate-300"
                      }`}
                    // onClick={() => toggleAssignee(user._id)}
                  >
                    <Checkbox
                      id={`user-${user._id}`}
                     
                      checked={formData.assignees.includes(user._id)}
                      onClick={() => toggleAssignee(user._id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Recurring Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Repeat className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-slate-700">Recurring Options</h3>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200/60">
              <Checkbox
                id="recurring"
                checked={formData.isRecurring}
               
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isRecurring: !!checked }))}
              />
              <Label htmlFor="recurring" className="font-medium text-slate-700">
                Make this a recurring task
              </Label>
            </div>

            {formData.isRecurring && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                <Label htmlFor="recurringType" className="text-sm font-medium text-slate-700">
                  Recurrence Pattern
                </Label>
                <Select
                  value={formData.recurringType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, recurringType: value as "Daily" | "Weekdays" | "Weekly" | "Monthly" | "Yearly" }))}
                >
                  <SelectTrigger className="h-12 bg-white/50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">📅 Daily</SelectItem>
                    <SelectItem value="Weekdays">🗓️ Weekdays Only</SelectItem>
                    <SelectItem value="Weekly">📆 Weekly</SelectItem>
                    <SelectItem value="Monthly">🗓️ Monthly</SelectItem>
                    <SelectItem value="Yearly">📅 Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.isRecurring && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                <Label htmlFor="recurringType" className="text-sm font-medium text-slate-700">
                  Recurrence Pattern
                </Label>
                <Select
                  value={formData.recurringType}
                  onValueChange={(value: string) => setFormData((prev) => ({ ...prev, recurringType: value as "Daily" | "Weekdays" | "Weekly" | "Monthly" | "Yearly" }))}
                >
                  <SelectTrigger className="h-12 bg-white/50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">📅 Daily</SelectItem>
                    <SelectItem value="Weekdays">🗓️ Weekdays Only</SelectItem>
                    <SelectItem value="Weekly">📆 Weekly</SelectItem>
                    <SelectItem value="Monthly">🗓️ Monthly</SelectItem>
                    <SelectItem value="Yearly">📅 Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {/* Reminder */}


          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-200/60">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-8 h-12 hover:bg-slate-50 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-8 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {task ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default React.memo(TaskForm)
