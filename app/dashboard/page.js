'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [links, setLinks] = useState([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        fetchLinks(user.id)
      }
    }
    getUser()
  }, [])

  const fetchLinks = async (userId) => {
    const { data } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setLinks(data || [])
  }

  const addLink = async () => {
    if (!title || !url) return
    await supabase.from('links').insert({ title, url, user_id: user.id })
    setTitle('')
    setUrl('')
    fetchLinks(user.id)
  }

  const deleteLink = async (id) => {
    await supabase.from('links').delete().eq('id', id)
    fetchLinks(user.id)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', padding: '2rem', color: '#f0f0f0' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontWeight: 500 }}>내 링크 모음</h1>
          <button onClick={handleLogout} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #333', background: 'transparent', color: '#888', cursor: 'pointer' }}>로그아웃</button>
        </div>

        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <input
            placeholder="사이트 이름"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #333', background: '#0f0f0f', color: '#f0f0f0', boxSizing: 'border-box' }}
          />
          <input
            placeholder="URL (https://...)"
            value={url}
            onChange={e => setUrl(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #333', background: '#0f0f0f', color: '#f0f0f0', boxSizing: 'border-box' }}
          />
          <button onClick={addLink} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: '#f0f0f0', color: '#0f0f0f', fontWeight: 500, cursor: 'pointer' }}>
            링크 추가
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {links.map(link => (
            <div key={link.id} style={{ background: '#1a1a1a', padding: '1rem 1.25rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#f0f0f0', textDecoration: 'none', fontWeight: 500 }}>
                {link.title}
              </a>
              <button onClick={() => deleteLink(link.id)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}