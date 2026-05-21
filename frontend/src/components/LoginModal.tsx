import { useState } from 'react'
import { X, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface LoginModalProps {
  onClose: () => void
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') await login(username, password)
      else await register(username, password)
      onClose()
    } catch (err: unknown) {
      type ApiError = { response?: { data?: { title?: string; errors?: Record<string, string[]> } } }
      const data = (err as ApiError)?.response?.data
      const details = data?.errors ? Object.values(data.errors).flat().join(' ') : null
      setError(details ?? data?.title ?? 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-bt-card border border-bt-border rounded-2xl p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-4">
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
                  tab === t
                    ? 'text-bt-text border-bt-purple'
                    : 'text-bt-muted border-transparent hover:text-bt-text'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="text-bt-muted hover:text-bt-text transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-bt-muted mb-1.5">Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-bt-surface border border-bt-border rounded-lg px-3 py-2 text-sm text-bt-text focus:outline-none focus:border-bt-purple transition-colors"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-bt-muted mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-bt-surface border border-bt-border rounded-lg px-3 py-2 text-sm text-bt-text focus:outline-none focus:border-bt-purple transition-colors"
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </div>
          {error && <p className="text-red-400 text-xs bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-bt-purple hover:bg-bt-violet disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {tab === 'login' ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
          {tab === 'login' && (
            <p className="text-center text-[11px] text-bt-muted">
              Demo accounts: <span className="font-mono text-bt-text/70">admin / Admin123!</span>
              {' '}or{' '}
              <span className="font-mono text-bt-text/70">guest / Guest123!</span>
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
