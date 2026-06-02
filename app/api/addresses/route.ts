import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

const CreateAddressSchema = z.object({
  label: z.string().min(1).max(50),
  street: z.string().min(5),
  city: z.string().min(2),
  province: z.string().min(2),
  zipCode: z.string().regex(/^\d{5}$/),
  fullName: z.string().min(2),
  phone: z.string().regex(/^(\+62|0)[0-9]{9,12}$/),
  isDefault: z.boolean().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Missing token' } },
        { status: 401 }
      )
    }

    const token = authHeader.slice(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Invalid token' } },
        { status: 401 }
      )
    }

    const addresses = await prisma.address.findMany({
      where: { userId: decoded.userId },
      orderBy: { isDefault: 'desc' },
    })

    return NextResponse.json({ data: addresses })
  } catch (error) {
    console.error('Get addresses error:', error)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch addresses' } },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Missing token' } },
        { status: 401 }
      )
    }

    const token = authHeader.slice(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Invalid token' } },
        { status: 401 }
      )
    }

    const body = await req.json()
    const data = CreateAddressSchema.parse(body)

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: decoded.userId },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.create({
      data: {
        ...data,
        userId: decoded.userId,
        isDefault: data.isDefault || false,
      },
    })

    return NextResponse.json({ data: address }, { status: 201 })
  } catch (error) {
    console.error('Create address error:', error)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create address' } },
      { status: 500 }
    )
  }
}
