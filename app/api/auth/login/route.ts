import { NextRequest, NextResponse } from 'next/server'
import { LoginSchema } from '@/lib/validation'
import { verifyPassword, generateTokens } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = LoginSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true, email: true, name: true, password: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } },
        { status: 401 }
      )
    }

    const passwordValid = await verifyPassword(data.password, user.password)
    if (!passwordValid) {
      return NextResponse.json(
        { error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } },
        { status: 401 }
      )
    }

    const { password, ...userWithoutPassword } = user
    const tokens = generateTokens(user.id, user.email)

    return NextResponse.json({
      data: { user: userWithoutPassword, ...tokens },
      meta: { timestamp: new Date().toISOString() },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Login failed' } },
      { status: 500 }
    )
  }
}
