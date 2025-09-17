import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { signAdminToken } from "@/lib/jwt";

const COOKIE_NAME = "otp";

function hashOtp(otp: string, email: string): string {
  const secret = process.env.SMTP_PASS ?? "";
  return crypto.createHmac("sha256", secret).update(`${email}:${otp}`).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const submittedOtp: string | undefined = body?.otp;
    const email: string | undefined = body?.email ?? process.env.ADMIN_EMAIL;

    if (!email) {
      return NextResponse.json({ ok: false, message: "Email is required" }, { status: 400 });
    }

    if (!submittedOtp || typeof submittedOtp !== "string") {
      return NextResponse.json({ ok: false, message: "OTP is required" }, { status: 400 });
    }

    // Get OTP cookie value robustly (support multiple cookies)
    let cookieValue = req.cookies.get(COOKIE_NAME)?.value;
    if (!cookieValue) {
      const header = req.headers.get("cookie") || "";
      const match = header
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${COOKIE_NAME}=`));
      if (match) cookieValue = match.split("=")[1];
    }

    if (!cookieValue) {
      return NextResponse.json({ ok: false, message: "OTP expired or not found" }, { status: 400 });
    }

    let payload: { hash: string; exp: number; email: string } | null = null;
    try {
      const decoded = Buffer.from(cookieValue, "base64").toString();
      payload = JSON.parse(decoded);
    } catch (err) {
      console.error("Invalid OTP cookie payload:", err);
      return NextResponse.json({ ok: false, message: "Invalid OTP payload" }, { status: 400 });
    }

    if (!payload?.hash || !payload?.exp || !payload?.email) {
      return NextResponse.json({ ok: false, message: "Invalid OTP payload" }, { status: 400 });
    }

    if (Date.now() > payload.exp) {
      const res = NextResponse.json({ ok: false, message: "OTP expired" }, { status: 400 });
      res.cookies.delete(COOKIE_NAME);
      return res;
    }

    if (payload.email !== email) {
      return NextResponse.json({ ok: false, message: "Email mismatch" }, { status: 400 });
    }

    const submittedHash = hashOtp(submittedOtp, email);
    // timingSafeEqual requires equal length buffers
    const a = Buffer.from(submittedHash);
    const b = Buffer.from(payload.hash);
    const valid = a.length === b.length && crypto.timingSafeEqual(a, b);

    if (!valid) {
      return NextResponse.json({ ok: false, message: "Invalid OTP" }, { status: 400 });
    }

    // Create admin JWT
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured in environment");
      return NextResponse.json({ ok: false, message: "Server misconfigured: JWT secret missing" }, { status: 500 });
    }
    const token = await signAdminToken({ email, role: "admin" });

    const res = NextResponse.json({ ok: true, message: "OTP verified" });
    // Invalidate OTP after successful verification
    res.cookies.delete(COOKIE_NAME);
    // Set auth_token cookie for 1 hour
    res.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
    });
    return res;
  } catch (error) {
    console.error("/api/verify-otp error:", error);
    return NextResponse.json({ ok: false, message: "Failed to verify OTP" }, { status: 500 });
  }
}


