'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          username,
          full_name: fullName
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert('Registration successful! Please login.')
        router.push('/login')
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        color: 'black',
        marginBottom: '10px',
        textAlign: 'center'
      }}>
        Create Account 
      </h1>
      
      <p style={{
        textAlign: 'center',
        color: 'black',
        marginBottom: '30px',
        fontSize: '14px'
      }}>
        Join us today! Create your account
      </p>
      
      {error && <p style={{color: 'red', marginBottom: '15px'}}>{error}</p>}
      
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ 
              width: '100%', 
              padding: '10px',
              border: '2px solid black',
              borderRadius: '8px'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={{ 
              width: '100%', 
              padding: '10px',
              border: '2px solid black',
              borderRadius: '8px'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name (optional)"
            style={{ 
              width: '100%', 
              padding: '10px',
              border: '2px solid black',
              borderRadius: '8px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ 
              width: '100%', 
              padding: '10px',
              border: '2px solid black',
              borderRadius: '8px'
            }}
            required
          />
        </div>
        
        <button 
          type="submit"
          style={{ 
            width: '100%', 
            padding: '10px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Register
        </button>
      </form>
      
      <p style={{
        textAlign: 'center',
        marginTop: '20px',
        color: '#6B7280',
        fontSize: '14px'
      }}>
        Already have an account?{' '}
        <a href="/login" style={{ color: 'blue', fontWeight: 'bold' }}>
          Login here
        </a>
      </p>
    </div>
  )
}