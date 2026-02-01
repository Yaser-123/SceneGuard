'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github } from "lucide-react"
import Link from "next/link"
import { useSignUp, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState, FormEvent, useEffect } from "react"

export default function SignUpPage() {
  const { signUp, setActive } = useSignUp()
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState("")

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard")
    }
  }, [isLoaded, isSignedIn, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!signUp) return
    
    setLoading(true)
    setError("")

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      setVerifying(true)
    } catch (err: any) {
      console.error("Sign up error:", err)
      setError(err.errors?.[0]?.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault()
    if (!signUp) return
    
    setLoading(true)
    setError("")

    try {
      const result = await signUp.attemptEmailAddressVerification({ code })

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        router.push("/dashboard")
      }
    } catch (err: any) {
      console.error("Verification error:", err)
      setError(err.errors?.[0]?.message || "Invalid verification code")
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignUp = async (provider: "oauth_google" | "oauth_github") => {
    if (!signUp) return

    try {
      await signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      })
    } catch (err: any) {
      console.error("OAuth error:", err)
      setError(err.errors?.[0]?.message || "OAuth sign-up failed")
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Section - Visual Panel */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:items-center lg:justify-center lg:p-12">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-background opacity-50"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(0deg, rgba(30, 144, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 144, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center text-white max-w-md">
          <div className="mb-4">
            <div className="text-xl font-bold tracking-tight text-accent mb-1">SCENEGUARD</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest">Production Feasibility Command Center</div>
          </div>
          
          <h2 className="mb-4 text-4xl font-bold leading-tight text-foreground">
            Production Decisions Start Here
          </h2>
          
          <p className="mb-12 text-sm text-muted-foreground leading-relaxed">
            Sign in to analyze scene feasibility, production risks, weather impact, and cost pressure before the shoot begins.
          </p>

          <div className="w-full space-y-3">
            <div className="rounded border border-accent/20 bg-slate-900/40 p-4 backdrop-blur-sm hover:border-accent/40 transition-colors">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-xs font-bold text-accent">1</span>
                <span className="text-sm text-foreground">Analyze scene feasibility</span>
              </div>
            </div>
            <div className="rounded border border-accent/20 bg-slate-900/40 p-4 backdrop-blur-sm hover:border-accent/40 transition-colors">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-xs font-bold text-accent">2</span>
                <span className="text-sm text-foreground">Identify production risks & cost drivers</span>
              </div>
            </div>
            <div className="rounded border border-accent/20 bg-slate-900/40 p-4 backdrop-blur-sm hover:border-accent/40 transition-colors">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-xs font-bold text-accent">3</span>
                <span className="text-sm text-foreground">Plan safer, smarter shoots</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Auth Form */}
    <div className="flex w-full items-center justify-center bg-black p-6 lg:w-1/2">
    <div className="w-full max-w-md">
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
            Create Your Account
        </h1>
        <p className="text-sm text-gray-300">
            {verifying ? "Enter the verification code sent to your email" : "Join SceneGuard to start analyzing scenes"}
        </p>
        </div>

        <div className="mb-8 space-y-3">
        <Button 
            variant="outline" 
            className="h-12 w-full border-gray-700 bg-gray-900 hover:bg-gray-800 text-white hover:text-white"
            onClick={() => handleOAuthSignUp("oauth_google")}
            type="button"
        >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="currentColor"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="currentColor"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="currentColor"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="currentColor"
            />
            </svg>
            Continue with Google
        </Button>
        <Button 
            variant="outline" 
            className="h-12 w-full border-gray-700 bg-gray-900 hover:bg-gray-800 text-white hover:text-white"
            onClick={() => handleOAuthSignUp("oauth_github")}
            type="button"
        >
            <Github className="mr-2 h-5 w-5" />
            Continue with GitHub
        </Button>
        </div>

        <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-xs">
            <span className="bg-black px-2 text-gray-400">Or</span>
        </div>
        </div>

        <form className="space-y-4" onSubmit={verifying ? handleVerify : handleSubmit}>
        {verifying ? (
          <>
            <div>
              <Input
                className="h-11 border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 rounded"
                placeholder="Verification code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  className="h-11 border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 rounded"
                  placeholder="First name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  className="h-11 border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 rounded"
                  placeholder="Last name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Input
                className="h-11 border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 rounded"
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                className="h-11 border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 rounded"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <Button 
            className="h-11 w-full bg-accent text-white hover:bg-accent/90 font-semibold rounded"
            type="submit"
            disabled={loading}
        >
            {loading ? "Please wait..." : verifying ? "Verify Email" : "Create Account"}
        </Button>

        <p className="text-center text-xs text-gray-400">
            Already have access?{" "}
            <Link
            href="/auth/sign-in"
            className="text-accent hover:text-accent/90 font-semibold transition-colors"
            >
            Sign in
            </Link>
        </p>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-700">
        <p className="text-center text-xs text-gray-400">
            Secure access for production planning teams
        </p>
        </div>
    </div>
    </div>
    </div>
  )
}