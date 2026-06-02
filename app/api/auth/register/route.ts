import { NextRequest, NextResponse } from 'next/server'
import { RegisterSchema } from '@/lib/validation'
import { hashPassword, generateTokens } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = RegisterSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: { code: 'USER_EXISTS', message: 'Email already registered' } },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(data.password)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
      select: { id: true, email: true, name: true },
    })

    const tokens = generateTokens(user.id, user.email)

    return NextResponse.json(
      {
        data: { user, ...tokens },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Registration failed' } },
      { status: 500 }
    )
  }
}
