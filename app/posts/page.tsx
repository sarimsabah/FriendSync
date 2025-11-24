'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PostsPage() {
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleCreatePost = async () => {
    setLoading(true)
    setError('')
    
    const token = localStorage.getItem('token')
    
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: content.trim()
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert('Post created successfully!')
        setContent('')
        setImage(null)
      } else {
        setError(data.error || 'Failed to create post')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '50px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: '30px'
      }}>
        Create New Post 
      </h1>

      {error && (
        <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>
      )}

      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            fontWeight: 'bold',
            color: '#374151',
            display: 'block',
            marginBottom: '10px'
          }}>
            What's on your mind?
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
            rows={5}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ccc',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'inherit'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            fontWeight: 'bold',
            color: '#374151',
            display: 'block',
            marginBottom: '10px'
          }}>
            Add Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #ccc',
              borderRadius: '8px'
            }}
          />
        </div>

        <button
          onClick={handleCreatePost}
          disabled={loading || !content.trim()}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#4F46E5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading || !content.trim() ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            opacity: loading || !content.trim() ? 0.6 : 1
          }}
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </div>
    </div>
  )
}