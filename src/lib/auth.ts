import { jwtVerify } from "jose";

export function getJwtSecret(): Uint8Array {
  const secret = process.env.APP_PASSWORD;
  if (!secret) throw new Error("APP_PASSWORD is not set");
  return new TextEncoder().encode(secret);
}

export async function verifyAuthToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}
