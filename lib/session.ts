import { SignJWT, jwtVerify } from "jose";

function getJwtSecret(): Uint8Array {
  const rawSecret = process.env.ADMIN_SECRET;
  if (!rawSecret || rawSecret.length < 32) {
    throw new Error(
      "[session] ADMIN_SECRET env var is missing or shorter than 32 characters. " +
      "Refusing to process session. Set a strong random secret (e.g. openssl rand -hex 32)."
    );
  }
  return new TextEncoder().encode(rawSecret);
}

/**
 * Signs a stateless JWT containing the admin email.
 * Defaults to an 8-hour expiry.
 */
export async function signSessionToken(
  email: string,
  durationSeconds = 8 * 60 * 60
): Promise<string> {
  const secret = getJwtSecret();
  return await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${durationSeconds}s`)
    .sign(secret);
}

/**
 * Verifies the stateless JWT session token.
 * Returns payload containing the admin's email if valid, or null.
 */
export async function verifySessionToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    if (payload && typeof payload.email === "string") {
      return { email: payload.email };
    }
    return null;
  } catch (error) {
    return null;
  }
}
