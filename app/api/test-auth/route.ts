import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const user = authenticate(request)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Please login' },
      { status: 401 }
    )
  }
  
  return NextResponse.json({
    message: 'You are authenticated!',
    user: {
      userId: user.userId,
      email: user.email,
      role: user.role
    }
  })
}