"use client"

import { useClerk } from "@clerk/nextjs"
import { useEffect } from "react"

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk()

  useEffect(() => {
    // Clerk's handler expects an object with redirect params; cast to any for compatibility
    handleRedirectCallback({ url: window.location.href } as any)
  }, [handleRedirectCallback])

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-4 text-xl font-bold text-white">Completing sign in...</div>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-accent mx-auto"></div>
      </div>
    </div>
  )
}
