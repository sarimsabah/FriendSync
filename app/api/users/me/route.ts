import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  // we will Authenticate user here
  const user = authenticate(request)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Please login' },
      { status: 401 }
    )
  }
  
  // we will get full user data from database
  const { data: userData, error } = await supabase
    .from('users')
    .select('id, email, username, full_name, bio, avatar_url, role, created_at, updated_at')
    .eq('id', user.userId)
    .single()
  
  if (error || !userData) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json({
    user: userData
  })
}

export async function PUT(request: NextRequest) {
  // Authenticate user
  const user = authenticate(request)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Please login' },
      { status: 401 }
    )
  }
  
  // Get update data from request
  const body = await request.json()
  const { full_name, bio, avatar_url } = body
  
  // Prepare update object (only include fields that were sent)
  const updateData: any = {}
  if (full_name !== undefined) updateData.full_name = full_name
  if (bio !== undefined) updateData.bio = bio
  if (avatar_url !== undefined) updateData.avatar_url = avatar_url
  updateData.updated_at = new Date().toISOString()
  
  // now we will be going update user in database
  const { data: updatedUser, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', user.userId)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json(
      { error: 'Failed to update profile', details: error.message },
      { status: 500 }
    )
  }
  
  // here we will remove password_hash from response
  const { password_hash, ...userWithoutPassword } = updatedUser
  
  return NextResponse.json({
    message: 'Profile updated successfully',
    user: userWithoutPassword
  })
}
