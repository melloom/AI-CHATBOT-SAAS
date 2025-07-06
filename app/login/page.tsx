"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { signInWithEmailAndPassword, signInWithMicrosoft } from "@/lib/auth-client"
import { Chrome, ArrowLeft, Building2 } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signInWithEmailAndPassword(email, password)
      
      toast({
        title: "Sign in successful!",
        description: "Welcome back to ChatHub.",
      })
      
      // Add a small delay to ensure the auth state is updated
      setTimeout(() => {
        router.push("/dashboard")
      }, 500)
      
    } catch (error: any) {
      console.error("Sign in error:", error)
      
      let errorMessage = "Failed to sign in. Please check your credentials and try again."
      
      // Handle specific error cases
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email address."
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again."
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later."
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled. Please contact support."
      } else if (error.message && error.message.includes('Account temporarily locked')) {
        errorMessage = error.message
      }
      
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMicrosoftSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithMicrosoft()
      toast({
        title: "Sign in successful!",
        description: "Welcome back to ChatHub.",
      })
      
      // Add a small delay to ensure the auth state is updated
      setTimeout(() => {
        router.push("/dashboard")
      }, 500)
      
    } catch (error: any) {
      console.error("Microsoft sign in error:", error)
      toast({
        title: "Sign in failed",
        description: "Failed to sign in with Microsoft. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center space-x-2">
            <Image 
              src="/LOGO.png" 
              alt="ChatHub Logo" 
              width={32} 
              height={32} 
              className="h-8 w-8"
            />
            <span className="font-bold text-2xl dark:text-white">ChatHub</span>
          </Link>
        </div>

        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your ChatHub account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button 
              variant="outline" 
              type="button" 
              className="w-full" 
              onClick={handleMicrosoftSignIn}
              disabled={isLoading}
            >
              <Building2 className="mr-2 h-4 w-4" />
              {isLoading ? "Signing in..." : "Sign in with Microsoft"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              <Link 
                href="/reset-password" 
                className="text-primary hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link 
                href="/signup" 
                className="text-primary hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
