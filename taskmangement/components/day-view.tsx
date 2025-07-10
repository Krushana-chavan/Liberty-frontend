"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, Edit, Sun, Moon, Coffee } from "lucide-react"
import type { Task, User } from "@/types/task"
import { useMemo, useCallback } from "react"

interface DayViewProps {
  tasks: Task[]
  selectedDate: string
  onDateChange: (date: string) => void
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
  onTaskEdit: (task: Task) => void
  users: User[]
  currentUser: User
}

function DayView({ tasks, selectedDate, onDateChange, onTaskEdit }: DayViewProps) {
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), [])

  const navigateDate = (direction: "prev" | "next") => {
    const currentDate = new Date(selectedDate)
    currentDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1))
    onDateChange(currentDate.toISOString().split("T")[0])
  }

  const getTasksForHour = useCallback(
    (hour: number) => {
      return tasks.filter((task) => {
        const taskHour = Number.parseInt(task.time.split(":")[0])
        return taskHour === hour
      })
    },
    [tasks],
  )

  const getTaskColor = (color: string) => {
    switch (color.toLowerCase()) {
      case "red":
        return "bg-gradient-to-r from-red-100 to-pink-100 border-red-300 text-red-800 shadow-red-100"
      case "green":
        return "bg-gradient-to-r from-emerald-100 to-teal-100 border-emerald-300 text-emerald-800 shadow-emerald-100"
      case "blue":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300 text-blue-800 shadow-blue-100"
      case "yellow":
        return "bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-300 text-amber-800 shadow-amber-100"
      default:
        return "bg-gradient-to-r from-slate-100 to-gray-100 border-slate-300 text-slate-800 shadow-slate-100"
    }
  }

  const getStatusColor = (status: string) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }



  const getTimeIcon = (hour: number) => {
    if (hour >= 6 && hour < 12) return <Sun className="w-4 h-4 text-amber-500" />
    if (hour >= 12 && hour < 18) return <Sun className="w-4 h-4 text-orange-500" />
    if (hour >= 18 && hour < 22) return <Moon className="w-4 h-4 text-indigo-500" />
    return <Moon className="w-4 h-4 text-slate-500" />
  }

  const isToday = selectedDate === new Date().toISOString().split("T")[0]
  const currentHour = new Date().getHours()

  return (
    <div className="space-y-6">
      <Card className="bg-white border-0 shadow-md">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Day Schedule</CardTitle>
                <p className="text-sm text-slate-500 mt-1">Manage your daily tasks and meetings</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("prev")}
                className="hover:bg-white/50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-auto bg-white/50 border-slate-200"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("next")}
                className="hover:bg-white/50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" className="bg-white/50">
              {formatDate(selectedDate)}
            </Badge>
            {isToday && <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse">Today</Badge>}
            <Badge variant="outline" className="bg-white/50">
              {tasks.length} tasks scheduled
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[70vh] overflow-y-auto">
            {hours.map((hour) => {
              const hourTasks = getTasksForHour(hour)
              const timeString = `${hour.toString().padStart(2, "0")}:00`
              const isCurrentHour = isToday && hour === currentHour

              return (
                <div
                  key={hour}
                  className={`flex border-b border-slate-100 min-h-[80px] ${
                    isCurrentHour ? "bg-blue-50 border-blue-200" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="w-24 flex-shrink-0 p-4 border-r border-slate-100 bg-slate-50/50">
                    <div className="flex flex-col items-center gap-1">
                      {getTimeIcon(hour)}
                      <span className={`text-sm font-medium ${isCurrentHour ? "text-blue-600" : "text-slate-600"}`}>
                        {timeString}
                      </span>
                      {isCurrentHour && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    {hourTasks.length === 0 ? (
                      <div className="h-full flex items-center text-slate-400 text-sm">
                        <Coffee className="w-4 h-4 mr-2" />
                        Free time
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {hourTasks.map((task, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102 ${getTaskColor(task.color)}`}
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-lg">{task.title}</h4>
                                  <Badge variant="outline" className="text-xs bg-white/80">
                                    {task.type === "Meeting" ? "🤝" : task.type === "Week-off" ? "🏖️" : "📋"} {task.type}
                                  </Badge>
                                  {task.reminder}
                                </div>
                                <p className="text-sm opacity-80 mb-3 font-medium">{task.company}</p>
                                <div className="flex items-center gap-4 text-sm mb-3">
                                  <span className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-md">
                                    <Clock className="w-3 h-3" />
                                    {task.time}
                                  </span>
                                  {task.assignees.length > 0 && (
                                    <span className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-md">
                                      <Users className="w-3 h-3" />
                                      {task.assignees.length} {task.type === "Meeting" ? "participants" : "assignees"}
                                    </span>
                                  )}
                                </div>

                                {task.notes && (
                                  <p className="text-sm opacity-75 mb-3 bg-white/30 p-2 rounded-md">{task.notes}</p>
                                )}
                              
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Badge className={`${getStatusColor(task.workflowStatus)} text-xs shadow-sm`}>
                                  {task.workflowStatus}
                                </Badge>
                                { (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onTaskEdit(task)}
                                    className="bg-white/50 hover:bg-white/80 transition-colors"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default React.memo(DayView)
