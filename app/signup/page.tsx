"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { createUserWithEmailAndPassword, signInWithMicrosoft } from "@/lib/auth-client"
import { Chrome, ArrowLeft, Building2, Brain } from "lucide-react"
import Image from "next/image"
import { CompanyAutocomplete } from "@/components/ui/company-autocomplete"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [accountType, setAccountType] = useState<"business" | "personal">("business")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Check for redirect parameter to determine account type and platform
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const redirect = urlParams.get('redirect')
    if (redirect === 'personal-ai') {
      setAccountType('personal')
    } else if (redirect === 'webvault') {
      setAccountType('business')
    }
  }, [])

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const urlParams = new URLSearchParams(window.location.search)
      const redirect = urlParams.get('redirect')
      const platform = redirect || 'general'
      
      console.log("Creating user with email:", email, "company:", companyName, "accountType:", accountType, "platform:", platform)
      await createUserWithEmailAndPassword(email, password, companyName, accountType, platform)
      
      if (accountType === 'personal') {
        toast({
          title: "Personal AI account created successfully!",
          description: "Your personal AI assistant account is ready. Welcome to ChatHub!",
        })
        router.push("/dashboard/personal-ai")
      } else if (platform === 'webvault') {
        toast({
          title: "WebVault account created successfully!",
          description: "Your account has been created and is pending approval. You'll be notified once approved.",
        })
        router.push("/pending-approval")
      } else {
        toast({
          title: "Account created successfully!",
          description: "Your account has been created and is pending approval. You'll be notified once approved.",
        })
        router.push("/pending-approval")
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      let errorMessage = "Failed to create account. Please try again."
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists. Please sign in instead."
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please choose a stronger password."
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address."
      }
      
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMicrosoftSignUp = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const redirect = urlParams.get('redirect')
      const platform = redirect || 'general'
      
      console.log("Starting Microsoft signup...", "accountType:", accountType, "platform:", platform)
      await signInWithMicrosoft(accountType, platform)
      
      if (accountType === 'personal') {
        toast({
          title: "Personal AI account created successfully!",
          description: "Your personal AI assistant account is ready. Welcome to ChatHub!",
        })
        router.push("/dashboard/personal-ai")
      } else if (platform === 'webvault') {
        toast({
          title: "WebVault account created successfully!",
          description: "Your account has been created and is pending approval. You'll be notified once approved.",
        })
        router.push("/pending-approval")
      } else {
        toast({
          title: "Welcome!",
          description: "Your account has been created and is pending approval. You'll be notified once approved.",
        })
        router.push("/pending-approval")
      }
    } catch (error: any) {
      console.error("Microsoft signup error:", error)
      let errorMessage = "Failed to create account with Microsoft. Please try again."
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign up was cancelled. Please try again."
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Pop-up was blocked. Please allow pop-ups and try again."
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = "An account with this email already exists with a different sign-in method."
      }
      
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
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
              priority
            />
            <span className="font-bold text-2xl dark:text-white">ChatHub</span>
          </Link>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <Card className="glass-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create account</CardTitle>
            <CardDescription className="text-center">
              {accountType === 'personal' 
                ? 'Create your personal AI assistant account' 
                : 'Enter your information to create your account'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Account Type Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Account Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={accountType === 'business' ? 'default' : 'outline'}
                  onClick={() => setAccountType('business')}
                  className="w-full"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Business
                </Button>
                <Button
                  type="button"
                  variant={accountType === 'personal' ? 'default' : 'outline'}
                  onClick={() => setAccountType('personal')}
                  className="w-full"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Personal AI
                </Button>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-transparent" onClick={handleMicrosoftSignUp}>
              <Building2 className="mr-2 h-4 w-4" />
              Continue with Microsoft
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleEmailSignUp} className="space-y-4">
              {accountType === 'business' && (
                <CompanyAutocomplete
                  value={companyName}
                  onValueChange={setCompanyName}
                  placeholder="Enter your company name or search..."
                  label="Company Name (Optional but recommended)"
                  required={false}
                />
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password (minimum 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
