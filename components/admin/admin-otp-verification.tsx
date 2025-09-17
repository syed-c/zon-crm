"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminOtpVerification() {
  const [step, setStep] = useState<"email" | "otp" | "done">("email");
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function requestOtp() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to send OTP");
      }
      setStep("otp");
    } catch (e: any) {
      setError(e?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Invalid OTP");
      }
      setStep("done");
    } catch (e: any) {
      setError(e?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Verification</CardTitle>
          <CardDescription>Verify your access with a one-time password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "email" && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Admin email</label>
              <Input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button onClick={requestOtp} disabled={loading || !email} className="w-full">
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Enter the 6-digit OTP sent to {email}</label>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep("email")} disabled={loading} className="flex-1">
                  Back
                </Button>
                <Button onClick={verifyOtp} disabled={loading || otp.length !== 6} className="flex-1">
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="space-y-2 text-center">
              <p className="text-green-700 font-medium">OTP verified, access granted</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


