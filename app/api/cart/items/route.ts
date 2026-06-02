import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

const AddToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
})

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
    const data = AddToCartSchema.parse(body)

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      select: { id: true, stock: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Product not found' } },
        { status: 404 }
      )
    }

    if (product.stock < data.quantity) {
      return NextResponse.json(
        { error: { code: 'INSUFFICIENT_STOCK', message: 'Not enough stock available' } },
        { status: 400 }
      )
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: decoded.userId },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: decoded.userId },
      })
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: data.productId,
        },
      },
    })

    let cartItem
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + data.quantity },
      })
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: data.productId,
          quantity: data.quantity,
        },
      })
    }

    return NextResponse.json({ data: cartItem }, { status: 201 })
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to add item to cart' } },
      { status: 500 }
    )
  }
}
