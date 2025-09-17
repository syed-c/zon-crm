import { SignJWT, jwtVerify } from "jose";

export type AdminClaims = {
  email: string;
  role: "admin";
};

const ONE_HOUR_SECONDS = 60 * 60;

export async function signAdminToken(claims: AdminClaims): Promise<string> {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  const key = new TextEncoder().encode(secret);
  const jwt = await new SignJWT(claims as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .setIssuedAt()
    .sign(key);
  return jwt;
}

export async function verifyToken(token: string): Promise<AdminClaims | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload as unknown as AdminClaims;
  } catch {
    return null;
  }
}


