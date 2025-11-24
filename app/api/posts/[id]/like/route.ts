import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = authenticate(request)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Please login' },
      { status: 401 }
    )
  }

  const { id: postId } = await params

  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.userId)
    .single()

  if (existingLike) {
    return NextResponse.json(
      { error: 'You already liked this post' },
      { status: 409 }
    )
  }

  const { error } = await supabase
    .from('likes')
    .insert([
      {
        post_id: postId,
        user_id: user.userId
      }
    ])

  if (error) {
    return NextResponse.json(
      { error: 'Failed to like post', details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    message: 'Post liked successfully'
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = authenticate(request)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Please login' },
      { status: 401 }
    )
  }

  const { id: postId } = await params

  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', user.userId)

  if (error) {
    return NextResponse.json(
      { error: 'Failed to unlike post', details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    message: 'Post unliked successfully'
  })
}