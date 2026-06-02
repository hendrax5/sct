import { NextRequest, NextResponse } from 'next/server'
import { ProductSchema } from '@/lib/validation'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = ProductSchema.parse(body)

    const existingSku = await prisma.product.findUnique({
      where: { sku: data.sku },
    })

    if (existingSku) {
      return NextResponse.json(
        { error: { code: 'SKU_EXISTS', message: 'SKU already exists' } },
        { status: 409 }
      )
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      },
    })

    return NextResponse.json({ data: product }, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create product' } },
      { status: 500 }
    )
  }
}
