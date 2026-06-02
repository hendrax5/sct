import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-change-in-production'
const JWT_EXPIRY = '15m'
const REFRESH_EXPIRY = '7d'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateTokens(userId: string, email: string) {
  const accessToken = jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  )

  const refreshToken = jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: REFRESH_EXPIRY }
  )

  return { accessToken, refreshToken }
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded as { userId: string; email?: string }
  } catch (error) {
    return null
  }
}
