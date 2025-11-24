import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const user = authenticate(request)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Please login' },
      { status: 401 }
    )
  }
  
  const body = await request.json()
  const { content, image_url } = body
  
  if (!content || content.trim() === '') {
    return NextResponse.json(
      { error: 'Post content is required' },
      { status: 400 }
    )
  }
  
  const { data: newPost, error } = await supabase
    .from('posts')
    .insert([
      {
        user_id: user.userId,
        content: content.trim(),
        image_url: image_url || null
      }
    ])
    .select()
    .single()
  
  if (error) {
    return NextResponse.json(
      { error: 'Failed to create post', details: error.message },
      { status: 500 }
    )
  }
  
  return NextResponse.json(
    {
      message: 'Post created successfully',
      post: newPost
    },
    { status: 201 }
  )
}

export async function GET(request: NextRequest) {
  const { data: posts, error } = await supabase
  .from('posts')
  .select(`
    id,
    content,
    image_url,
    created_at,
    updated_at,
    user_id,
    users (
      id,
      username,
      full_name,
      avatar_url
    ),
    likes (
      id,
      user_id
    )
  `)
  .order('created_at', { ascending: false })
  
  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: error.message },
      { status: 500 }
    )
  }
  
  return NextResponse.json({
    posts: posts || []
  })
}