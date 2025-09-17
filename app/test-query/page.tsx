"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function TestQueryPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  const user = useQuery(api.otpAuth.getCurrentUser, sessionId ? { sessionId } : "skip")
  
  const handleTest = () => {
    const storedSessionId = localStorage.getItem("otp_session_id")
    console.log("Test - Stored session ID:", storedSessionId)
    setSessionId(storedSessionId)
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Query</h1>
      <div className="space-y-4">
        <button 
          onClick={handleTest}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Query
        </button>
        <div>
          <strong>Session ID:</strong> {sessionId || "None"}
        </div>
        <div>
          <strong>User:</strong> {user ? JSON.stringify(user, null, 2) : "Loading..."}
        </div>
        <div>
          <strong>User Status:</strong> {user === undefined ? "Loading" : user === null ? "No user" : "User found"}
        </div>
      </div>
    </div>
  )
}
