'use client'

import { useState, useEffect } from 'react'

export default function FeedPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const userString = localStorage.getItem('user')
    if (userString) {
      setCurrentUser(JSON.parse(userString))
    }
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      
      if (response.ok) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId))
        alert('Post deleted successfully!')
      } else {
        alert(data.error || 'Failed to delete post')
      }
    } catch (error) {
      alert('Something went wrong')
    }
  }

  const handleLike = async (postId: string, isLiked: boolean) => {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Please login to like posts')
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        fetchPosts()
      } else {
        alert(data.error || 'Failed to like post')
      }
    } catch (error) {
      alert('Something went wrong')
    }
  }

  const isPostLikedByUser = (post: any) => {
    if (!currentUser) return false
    return post.likes?.some((like: any) => like.user_id === currentUser.id)
  }

  return (
    <div style={{ padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: '30px'
      }}>
        Feed 📰
      </h1>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p style={{ color: '#6B7280', textAlign: 'center', marginTop: '50px' }}>
          No posts yet. Create the first one!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {posts.map((post) => {
            const isLiked = isPostLikedByUser(post)
            const likeCount = post.likes?.length || 0

            return (
              <div
                key={post.id}
                style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '15px',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#4F46E5',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}>
                    {post.users?.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
                      {post.users?.full_name || post.users?.username || 'Anonymous'}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                      @{post.users?.username || 'unknown'}
                    </p>
                  </div>
                </div>

                <p style={{ 
                  fontSize: '16px', 
                  color: '#1F2937',
                  marginBottom: '10px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {post.content}
                </p>

                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Post image"
                    style={{
                      width: '100%',
                      maxHeight: '500px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      marginBottom: '10px'
                    }}
                  />
                )}

                <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '15px' }}>
                  {new Date(post.created_at).toLocaleString()}
                </p>

                <div style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <button
                    onClick={() => handleLike(post.id, isLiked)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: isLiked ? '#EF4444' : '#F3F4F6',
                      color: isLiked ? 'white' : '#1F2937',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    {isLiked ? '❤️' : '🤍'} {likeCount}
                  </button>
                </div>

                {currentUser && post.user_id === currentUser.id && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    style={{
                      marginTop: '10px',
                      padding: '8px 16px',
                      backgroundColor: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    Delete Post
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}