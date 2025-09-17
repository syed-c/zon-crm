import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value || "";
    if (!token) {
      return NextResponse.json({ ok: false, user: null }, { status: 200 });
    }
    const claims = await verifyToken(token);
    if (!claims) {
      return NextResponse.json({ ok: false, user: null }, { status: 200 });
    }
    return NextResponse.json({ ok: true, user: claims }, { status: 200 });
  } catch (error) {
    console.error("/api/me error:", error);
    return NextResponse.json({ ok: false, user: null }, { status: 200 });
  }
}


