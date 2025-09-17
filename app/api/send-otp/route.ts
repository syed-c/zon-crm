import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

const COOKIE_NAME = "otp";
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

type OtpCookie = {
  hash: string;
  exp: number;
  email: string;
};

function generateOtp(): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}

function hashOtp(otp: string, email: string): string {
  const secret = process.env.SMTP_PASS ?? "";
  return crypto.createHmac("sha256", secret).update(`${email}:${otp}`).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email: string | undefined = body?.email ?? process.env.ADMIN_EMAIL;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env as Record<string, string | undefined>;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      return NextResponse.json({ error: "SMTP is not configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const otp = generateOtp();
    const hashed = hashOtp(otp, email);
    const exp = Date.now() + OTP_TTL_MS;

    const cookiePayload: OtpCookie = { hash: hashed, exp, email };

    const res = NextResponse.json({ ok: true });

    res.cookies.set({
      name: COOKIE_NAME,
      value: Buffer.from(JSON.stringify(cookiePayload)).toString("base64"),
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Math.floor(OTP_TTL_MS / 1000),
    });

    const fromAddress = process.env.ADMIN_EMAIL || SMTP_USER;

    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: "Your Admin OTP Code",
      text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
      html: `<p>Your OTP code is <strong>${otp}</strong>.</p><p>It expires in 5 minutes.</p>`,
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}


