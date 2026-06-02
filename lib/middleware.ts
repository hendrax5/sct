import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'

export function withAuth(handler: (req: NextRequest, decoded: any) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
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
        { error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } },
        { status: 401 }
      )
    }

    return handler(req, decoded)
  }
}

export function withAdminAuth(handler: (req: NextRequest, decoded: any) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
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

    const user = await require('./db').prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      )
    }

    return handler(req, decoded)
  }
}
