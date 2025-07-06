"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { sendPasswordResetEmail } from "@/lib/auth-client"
import Image from "next/image"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { toast } = useToast()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await sendPasswordResetEmail(email)
      setEmailSent(true)
      toast({
        title: "Reset email sent!",
        description: "Check your inbox for password reset instructions.",
      })
    } catch (error) {
      toast({
        title: "Reset failed",
        description: "Failed to send reset email. Please check your email address.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
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
              <span className="font-bold text-2xl">ChatHub</span>
            </Link>
          </div>
          
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Check your email</CardTitle>
              <CardDescription className="text-center">We've sent a password reset link to {email}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/login" className="w-full">
                <Button className="w-full">Back to login</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
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
            <span className="font-bold text-2xl">ChatHub</span>
          </Link>
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset password</CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset email"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-primary w-full text-center">
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
