'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  full_name?: string
  username: string
  email: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userString = localStorage.getItem('user')
    
    if (userString) {
      const userData = JSON.parse(userString)
      setUser(userData)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/login')
  }

  return (
    <div style={{ padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: '20px'
      }}>
        Welcome to FriendSync! 
      </h1>
      
      {user ? (
        <div>
          <p style={{ fontSize: '18px', color: '#4B5563', marginBottom: '10px' }}>
            Hello, <strong>{user.full_name || user.username}</strong>!
          </p>
          <p style={{ color: '#6B7280', marginBottom: '20px' }}>
            Email: {user.email}
          </p>
          
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#EF4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p style={{ color: '#6B7280', marginBottom: '20px' }}>
            You are not logged in.
          </p>
          
          <a href="/login">
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#4F46E5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginRight: '10px'
            }}>
              Login
            </button>
          </a>
          
          <a href="/register">
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              Register
            </button>
          </a>
        </div>
      )}
    </div>
  )
}