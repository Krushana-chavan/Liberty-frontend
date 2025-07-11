"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Target, Mail, Lock, User, Eye, EyeOff, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Router from "next/router"
import Swal from "sweetalert2"

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let result
      let SignupResult
      if (isSignUp) {
         SignupResult= await signUp(formData.name, formData.email, formData.password)
      } else {
        result = await signIn(formData.email, formData.password)
      }
      console.log("SignIn Result:", SignupResult)
      if (SignupResult?.success) {
        setFormData({ name: "", email: "", password: "" })
        Swal.fire({
          title: "Account Created",
          text: "Your account has been created successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setIsSignUp(false)
        })
       
       
        return
      }
      if (result?.success) {
        setFormData({ name: "", email: "", password: "" })
        Swal.fire({
          title: "Welcome Back",
          text: "You have successfully signed in!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          Router.push("/dashboard")
        })
        return
      }
      if (!result?.success && !SignupResult?.success) {
        setError(result?.error || "Authentication failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      console.error("Authentication error:", err)
    } finally {
      setLoading(false)
    }
  }

 



  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-8">
          <div className="flex items-center justify-center lg:justify-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-slate-500">Streamline your workflow</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Manage tasks with precision and clarity</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Collaborate seamlessly with role-based permissions, real-time updates, and intuitive task management.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[
                { icon: "🎯", title: "Task Assignment", desc: "Delegate with precision" },
                { icon: "👥", title: "Team Collaboration", desc: "Work together efficiently" },
                { icon: "📊", title: "Progress Tracking", desc: "Monitor task status" },
                { icon: "🔒", title: "Role-based Access", desc: "Secure permissions" },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-xl backdrop-blur-sm">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-800">{feature.title}</p>
                    <p className="text-sm text-slate-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="space-y-6">
          <Card className="bg-white border shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">{isSignUp ? "Create Account" : "Welcome Back"}</CardTitle>
              <p className="text-slate-500">
                {isSignUp ? "Join TaskFlow to start managing tasks" : "Sign in to your TaskFlow account"}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required={isSignUp}
                        className="pl-10 h-12 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                      className="pl-10 h-12 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      required
                      className="pl-10 pr-10 h-12 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                      placeholder="Enter your password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isSignUp ? "Creating Account..." : "Signing In..."}
                    </div>
                  ) : isSignUp ? (
                    "Create Account"
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError("")
                    setFormData({ name: "", email: "", password: "" })
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
