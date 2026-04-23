import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const secret = process.env.AUTH_SECRET ?? "dev-auth-secret-change-me";
const secretKey = new TextEncoder().encode(secret);

export type SessionPayload = {
  userId: number;
  role: "ADMIN" | "PROFESSIONAL";
  professionalId?: number;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifySession(token: string) {
  const verified = await jwtVerify<SessionPayload>(token, secretKey);
  return verified.payload;
}
