"use client"

import { useState } from "react"
import { useAuthActions } from "@convex-dev/auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Key, Users, Shield } from "lucide-react"
import Link from "next/link"

export default function LoginPageContent() {
  const { signIn } = useAuthActions()
  const router = useRouter()
  const [step, setStep] = useState<"email" | "code">("email")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const formData = new FormData(e.currentTarget)
      const emailValue = formData.get("identifier") as string
      setEmail(emailValue)
      
      console.log("Attempting to sign in with email:", emailValue)
      console.log("Form data:", Object.fromEntries(formData.entries()))
      
      await signIn("smtp-otp", formData)
      setStep("code")
    } catch (err) {
      setError("Failed to send verification code. Please try again.")
      console.error("Email submission error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const formData = new FormData(e.currentTarget)
      await signIn("smtp-otp", formData)
      router.push("/dashboard")
    } catch (err) {
      setError("Invalid verification code. Please try again.")
      console.error("Code verification error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-crm-background via-crm-surface to-crm-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-crm-text-secondary hover:text-crm-text mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-crm-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <span className="text-3xl font-bold text-crm-text">ZON</span>
          </div>
          <p className="text-crm-text-secondary">Sign in to your CRM account</p>
        </div>

        {/* Login Form */}
        <Card className="bg-crm-card border-crm-border">
          <CardHeader>
            <CardTitle className="text-crm-text text-center">
              {step === "email" ? "Welcome Back" : "Verify Your Email"}
            </CardTitle>
            <CardDescription className="text-crm-text-secondary text-center">
              {step === "email" 
                ? "Enter your email to receive a verification code" 
                : `We sent a verification code to ${email}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "email" ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-crm-text">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crm-text-secondary h-4 w-4" />
                    <Input
                      id="identifier"
                      name="identifier"
                      type="email"
                      placeholder="you@company.com"
                      required
                      className="pl-10 bg-crm-background border-crm-border text-crm-text"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                {error && (
                  <div className="text-red-400 text-sm text-center">{error}</div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-crm-primary hover:bg-crm-primary/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <input name="identifier" value={email} type="hidden" />
                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium text-crm-text">
                    Verification Code
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crm-text-secondary h-4 w-4" />
                    <Input
                      id="code"
                      name="code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      required
                      className="pl-10 bg-crm-background border-crm-border text-crm-text"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                {error && (
                  <div className="text-red-400 text-sm text-center">{error}</div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-crm-primary hover:bg-crm-primary/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify & Sign In"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full text-crm-text-secondary hover:text-crm-text"
                  onClick={() => setStep("email")}
                  disabled={isLoading}
                >
                  Use different email
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="bg-crm-card border-crm-border mt-6">
          <CardHeader>
            <CardTitle className="text-crm-text text-center text-lg">Demo Accounts</CardTitle>
            <CardDescription className="text-crm-text-secondary text-center">
              Use these accounts to test the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-crm-background rounded-lg border border-crm-border">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-crm-primary" />
                <div>
                  <div className="text-sm font-medium text-crm-text">Admin Account</div>
                  <div className="text-xs text-crm-text-secondary">admin@zon.ae</div>
                </div>
              </div>
              <Badge className="bg-crm-primary/20 text-crm-primary border-crm-primary/30">
                Full Access
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-crm-background rounded-lg border border-crm-border">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="text-sm font-medium text-crm-text">Manager Account</div>
                  <div className="text-xs text-crm-text-secondary">manager@zon.ae</div>
                </div>
              </div>
              <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">
                Manager
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-crm-background rounded-lg border border-crm-border">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-green-400" />
                <div>
                  <div className="text-sm font-medium text-crm-text">Editor Account</div>
                  <div className="text-xs text-crm-text-secondary">editor@zon.ae</div>
                </div>
              </div>
              <Badge className="bg-green-400/20 text-green-400 border-green-400/30">
                Editor
              </Badge>
            </div>
            
            <div className="text-xs text-crm-text-secondary text-center mt-4">
              Simply enter any of these email addresses above to receive a verification code
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}