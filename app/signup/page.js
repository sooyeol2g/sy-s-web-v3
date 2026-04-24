'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
    } else {
      setMessage('이메일 확인 후 로그인해주세요!')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f' }}>
      <div style={{ background: '#1a1a1a', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '360px' }}>
        <h1 style={{ color: '#f0f0f0', fontWeight: 500, marginBottom: '1.5rem', textAlign: 'center' }}>회원가입</h1>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #333', background: '#0f0f0f', color: '#f0f0f0', boxSizing: 'border-box' }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #333', background: '#0f0f0f', color: '#f0f0f0', boxSizing: 'border-box' }}
        />
        {error && <p style={{ color: '#ff6b6b', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}
        {message && <p style={{ color: '#6bff6b', fontSize: '14px', marginBottom: '12px' }}>{message}</p>}
        <button
          onClick={handleSignup}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: '#f0f0f0', color: '#0f0f0f', fontWeight: 500, cursor: 'pointer' }}
        >
          회원가입
        </button>
        <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', marginTop: '1rem' }}>
          이미 계정이 있어요? <a href="/login" style={{ color: '#f0f0f0' }}>로그인</a>
        </p>
      </div>
    </div>
  )
}