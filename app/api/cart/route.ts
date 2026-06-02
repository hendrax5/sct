import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

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

    let cart = await prisma.cart.findUnique({
      where: { userId: decoded.userId },
      include: {
        items: {
          include: { product: { select: { id: true, name: true, price: true, stock: true } } },
        },
      },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: decoded.userId },
        include: { items: true },
      })
    }

    const total = cart.items.reduce((sum, item) => {
      const product = (item as any).product
      return sum + product.price * item.quantity
    }, 0)

    return NextResponse.json({
      data: {
        ...cart,
        total,
        itemCount: cart.items.length,
      },
    })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch cart' } },
      { status: 500 }
    )
  }
}
