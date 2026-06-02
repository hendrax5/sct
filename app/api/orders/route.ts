import { NextRequest, NextResponse } from 'next/server'
import { CreateOrderSchema } from '@/lib/validation'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

function generateOrderNumber(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token' } },
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
    const data = CreateOrderSchema.parse(body)

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: decoded.userId,
        subtotal: 0,
        shippingCost: 0,
        total: 0,
        shippingAddress: data.shippingAddressId,
        paymentMethod: data.paymentMethod,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            pricePerUnit: 0,
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json({ data: order }, { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create order' } },
      { status: 500 }
    )
  }
}
