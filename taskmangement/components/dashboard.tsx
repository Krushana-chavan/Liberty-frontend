"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Swal from 'sweetalert2'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  Users,
  Plus,
  CheckCircle,
  Circle,
  ArrowRight,
  User,
  TrendingUp,
  Target,
  LogOut,
  Shield,
  UserCheck,
  Trash,
} from "lucide-react"
import TaskForm from "@/components/task-form"

import DayView from "@/components/day-view"
import UserManagement from "@/components/user-management"
import { useAuth } from "@/contexts/auth-context"
import type { Task, WorkflowStatus } from "@/types/task"
import { apiRequest } from "@/lib/api"



export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [tasks, setTasks] = useState<Task[]>()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [activeTab, setActiveTab] = useState("dashboard")

  console.log("Current User:", user)
  const handleCreateTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      userId: user?._id || "",
      createdAt: new Date().toISOString(),
    }

    console.log(newTask)
    try {
      const result = await apiRequest({
        url: "/task/create",
        method: "POST",
        data: newTask,
      })
      console.log("Task created successfully:", result)

      setShowTaskForm(false)
      getAllTasks()
    } catch (error) {
      console.error("Error creating task:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create task. Please try again.",
      })
    }



    if (taskData.assignees.length > 0) {
      console.log(`Email notifications sent to assignees for task: ${taskData.title}`)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      const result = await apiRequest({
        url: `/task/deleteTask/${taskId}`,
        method: "DELETE",
      })
      console.log("Task deleted successfully:", result)
      getAllTasks()
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Task deleted successfully!",
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete task. Please try again.",
      })
    }
  }


  const getAllTasks = async () => {
    console.log("user",)
    try {
      const response = await apiRequest({
        url: user?.role == "admin" ? "/task/getAllTask" : `/task/loggedInUserTasks/${user?._id}`,
        method: "GET",
      })
      setTasks(response)
      console.log("Fetched tasks:", response)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch tasks. Please try again.",
      })
    }
  }

  useEffect(() => {
    getAllTasks()
  }, [])
  interface UpdateTaskData {
    title?: string
    description?: string
    date?: string
    time?: string
    company?: string
    color?: string
    workflowStatus?: WorkflowStatus
    completionStatus?: string
    assignees?: string[]
    // Allow additional fields
  }

  const handleUpdateTask = async (
    id: string,
    data: UpdateTaskData
  ): Promise<void> => {

    const updatetResult = await apiRequest({
      url: `/task/updateTask/${id}`,
      method: "PUT",
      data
    }

    )
    getAllTasks()
    console.log("Task updated successfully:", updatetResult)
    setEditingTask(null)
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Task updated successfully!",
    })
  }


  const getStatusColor = (status: WorkflowStatus) => {
    switch (status) {
      case "No Action":
        return "bg-slate-500 hover:bg-slate-600"
      case "Accepted":
        return "bg-blue-500 hover:bg-blue-600"
      case "In Progress":
        return "bg-amber-500 hover:bg-amber-600"
      case "Done":
        return "bg-emerald-500 hover:bg-emerald-600"
      default:
        return "bg-slate-500 hover:bg-slate-600"
    }
  }

  const todayTasks = tasks && tasks.filter((task) => task.date === selectedDate)
  const overdueTasks = tasks && tasks.filter((task) => new Date(task.date) < new Date() && task.completionStatus === "Pending")

  const isTaskOwner = (task: Task) => task.ownerId === user?._id
  const isTaskAssignee = (task: Task) => task.assignees.includes(user?._id || "")
  const canViewTask = (task: Task) => isTaskOwner(task) || isTaskAssignee(task)

  const userTasks = tasks && tasks.filter(canViewTask)
  const ownedTasks = tasks && tasks.filter(isTaskOwner)
  const assignedTasks = tasks && tasks.filter(isTaskAssignee)

  const stats = useMemo(
    () => ({
      total: userTasks?.length,
      owned: ownedTasks?.length,
      assigned: assignedTasks?.length,
      completed: userTasks?.filter((t) => t.completionStatus === "Completed").length,
      pending: userTasks?.filter((t) => t.completionStatus === "Pending").length,
      overdue: overdueTasks?.length,
    }),
    [userTasks, ownedTasks, assignedTasks, overdueTasks],
  )

  const completionRate = useMemo(
    () => ((stats.total ?? 0) > 0 ? Math.round(((stats.completed ?? 0) / (stats.total ?? 1)) * 100) : 0),
    [stats.total, stats.completed],
  )

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Enhanced Header with User Info */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-sm text-slate-500">Streamline your workflow</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 bg-white/50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <User className="w-3 h-3" />
                {user.name}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 bg-blue-50">
                <Shield className="w-3 h-3 text-blue-600" />
                Task Manager
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
           { user.role == "admin" &&  <Button
              onClick={() => setShowTaskForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>}

            <Button
              variant="outline"
              size="icon"
              onClick={signOut}
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors bg-transparent"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar with Role Info */}
        <nav className="w-72 bg-white border-r border-slate-200 min-h-screen p-6">
          <div className="space-y-3">
            {[
              { id: "dashboard", label: "Dashboard", icon: TrendingUp, gradient: "from-blue-500 to-indigo-500" },
              { id: "day-view", label: "Day View", icon: Calendar, gradient: "from-emerald-500 to-teal-500" },
              ...(user?.role === "admin"
                ? [{ id: "users", label: "Team", icon: Users, gradient: "from-purple-500 to-pink-500" }]
                : []),
            ].map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`w-full justify-start h-12 transition-all duration-200 ${activeTab === item.id
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg hover:shadow-xl transform scale-105`
                    : "hover:bg-slate-50 hover:scale-102"
                  }`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            ))}

          </div>

          {/* Role-based Quick Stats */}
          <div className="mt-8 p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200/60">
            <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-500" />
              Your Role Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Tasks Owned</span>
                <span className="font-bold text-blue-600">{stats.owned}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Tasks Assigned</span>
                <span className="font-bold text-purple-600">{stats.assigned}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Completion Rate</span>
                <span className="font-bold text-emerald-600">{completionRate}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>

        </nav>

        <main className="flex-1 p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Enhanced Stats Cards with Role-based Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Total Tasks",
                    value: stats.total,
                    icon: Circle,
                    gradient: "from-blue-500 to-indigo-500",
                    bgGradient: "from-blue-50 to-indigo-50",
                    description: "All accessible tasks",
                  },
                 
                  {
                    title: "Assigned to You",
                    value: stats.assigned,
                    icon: UserCheck,
                    gradient: "from-purple-500 to-pink-500",
                    bgGradient: "from-purple-50 to-pink-50",
                    description: "Tasks assigned by others",
                  },
                  {
                    title: "Overdue",
                    value: stats.overdue,
                    icon: ArrowRight,
                    gradient: "from-red-500 to-pink-500",
                    bgGradient: "from-red-50 to-pink-50",
                    description: "Needs immediate attention",
                  },
                ].map((stat, index) => (
                  <Card
                    key={index}
                    className={`bg-gradient-to-br ${stat.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                        <p className="text-xs text-slate-500">{stat.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Today's Tasks with Permission Context */}
              <Card className="bg-white/60 backdrop-blur-md border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    Today&#39;s Focus
                    <Badge variant="outline" className="ml-auto">
                      {todayTasks?.length} tasks
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {todayTasks?.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 text-lg">All caught up for today! 🎉</p>
                      <p className="text-slate-400 text-sm mt-1">Time to plan tomorrow or take a well-deserved break</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {todayTasks?.map((task, index) => (
                        <div
                          key={index}
                          className="group p-4 bg-white rounded-xl border border-slate-200/60 hover:shadow-lg transition-all duration-300 transform hover:scale-102"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-4 h-4 rounded-full bg-${task.color.toLowerCase()}-500 shadow-lg`} />
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {task.title}
                                  </p>
                                 
                                  {isTaskAssignee(task) && !isTaskOwner(task) && (
                                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                                      Assigned
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                  <p className="text-sm text-slate-500">{task.company}</p>
                                  <span className="text-slate-300">•</span>
                                  <p className="text-sm text-slate-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {task.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={`${getStatusColor(task.workflowStatus)} transition-all duration-200`}>
                                {task.workflowStatus}
                              </Badge>
                               {user.role == "admin" && (
                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700"  onClick={()=>{handleDeleteTask(task?._id)}}>
                                      <Trash/>
                                    </Badge>
                                  )}
                              {task.assignees.length > 0 && (
                                <Badge variant="outline" className="bg-white/50">
                                  <Users className="w-3 h-3 mr-1" />
                                  {task.assignees.length}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Overdue Tasks */}
              {overdueTasks && overdueTasks?.length > 0 && (
                <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200/60 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-red-700">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                      Needs Attention
                      <Badge variant="destructive" className="animate-pulse">
                        {overdueTasks?.length} overdue
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {overdueTasks.map((task, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-red-200/60 shadow-sm hover:shadow-md transition-all duration-200"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-4 h-4 rounded-full bg-${task.color.toLowerCase()}-500 animate-pulse`} />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-slate-900">{task.title}</p>
                                {isTaskOwner(task) && (
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                    Owner
                                  </Badge>
                                )}
                                {isTaskAssignee(task) && !isTaskOwner(task) && (
                                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                                    Assigned
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-600">
                                {task.company} • {task.date} {task.time}
                              </p>
                            </div>
                          </div>
                          <Badge variant="destructive" className="animate-pulse">
                            Overdue
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "day-view" && (
            <DayView
              tasks={todayTasks || []}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onTaskUpdate={handleUpdateTask}
              onTaskEdit={setEditingTask}
              users={[]}
              currentUser={user}
            />
          )}


          {activeTab === "users" && <UserManagement />}
        </main>
      </div>

      {/* Task Form Modal with Permission Checks */}
      {(showTaskForm || editingTask) && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <TaskForm
            task={editingTask}
            users={[]}
            currentUser={user}

            onSubmit={
              editingTask && editingTask._id
                ? (data) => {
                  handleUpdateTask(editingTask._id as string, data)
                  setEditingTask(null)
                }
                : handleCreateTask
            }
            onClose={() => {
              setShowTaskForm(false)
              setEditingTask(null)
            }}
          />
        </div>
      )}
    </div>
  )
}
