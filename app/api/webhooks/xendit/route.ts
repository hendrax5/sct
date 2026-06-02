import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const xCallback = req.headers.get('x-callback-token') || ''
    const body = await req.text()

    const webhookData = JSON.parse(body)

    const order = await prisma.order.findUnique({
      where: { id: webhookData.external_id.replace('ORDER-', '') },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const payment = await prisma.payment.findFirst({
      where: { orderId: order.id },
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    if (webhookData.status === 'PAID') {
      await Promise.all([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            xenditStatus: 'PAID',
            status: 'CONFIRMED',
          },
        }),
        prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'CONFIRMED',
            status: 'PROCESSING',
          },
        }),
      ])

      console.log(`Payment confirmed for order ${order.orderNumber}`)
    } else if (webhookData.status === 'EXPIRED') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          xenditStatus: 'EXPIRED',
          status: 'FAILED',
        },
      })

      console.log(`Payment expired for order ${order.orderNumber}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Xendit webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
