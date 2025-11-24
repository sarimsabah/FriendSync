import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

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

  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single()

  if (fetchError || !post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    )
  }

  if (post.user_id !== user.userId) {
    return NextResponse.json(
      { error: 'You can only delete your own posts' },
      { status: 403 }
    )
  }

  const { error: deleteError } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (deleteError) {
    return NextResponse.json(
      { error: 'Failed to delete post', details: deleteError.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    message: 'Post deleted successfully'
  })
}