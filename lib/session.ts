import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET || "fallback_secret_at_least_32_characters_long"
);

/**
 * Signs a stateless JWT containing the admin email.
 * Defaults to an 8-hour expiry.
 */
export async function signSessionToken(
  email: string,
  durationSeconds = 8 * 60 * 60
): Promise<string> {
  return await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${durationSeconds}s`)
    .sign(JWT_SECRET);
}

/**
 * Verifies the stateless JWT session token.
 * Returns payload containing the admin's email if valid, or null.
 */
export async function verifySessionToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload && typeof payload.email === "string") {
      return { email: payload.email };
    }
    return null;
  } catch (error) {
    return null;
  }
}
