import { useState } from 'react'
import { BookOpen, Search, User, LogOut, Plus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import LoginModal from './LoginModal'

type Page = 'browse' | 'library' | 'stats'

interface HeaderProps {
  page: Page
  onNavigate: (page: Page) => void
  searchQuery: string
  onSearch: (q: string) => void
  onAddBook: () => void
}

const NAV: { label: string; page: Page }[] = [
  { label: 'Browse', page: 'browse' },
  { label: 'My Library', page: 'library' },
  { label: 'Stats', page: 'stats' },
]

export default function Header({ page, onNavigate, searchQuery, onSearch, onAddBook }: HeaderProps) {
  const [showLogin, setShowLogin] = useState(false)
  const { user, logout, isAdmin } = useAuth()

  return (
    <>
      <header className="sticky top-0 z-50 bg-bt-bg/95 backdrop-blur-sm border-b border-bt-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('browse')}
            className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
          >
            <BookOpen className="h-6 w-6 text-bt-purple" />
            <span className="text-lg font-bold tracking-tight text-bt-text">BookTrack</span>
          </button>

          {page === 'browse' && (
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bt-muted pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => onSearch(e.target.value)}
                  placeholder="Search books, authors…"
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-bt-card border border-bt-border text-sm text-bt-text placeholder:text-bt-muted focus:outline-none focus:border-bt-purple transition-colors"
                />
              </div>
            </div>
          )}

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {NAV.map(item => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`font-medium transition-colors ${
                  page === item.page ? 'text-bt-purple' : 'text-bt-muted hover:text-bt-text'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <button
                onClick={onAddBook}
                className="flex items-center gap-1.5 text-sm bg-bt-purple/20 hover:bg-bt-purple/30 text-bt-purple px-3 py-2 rounded-full transition-colors font-medium"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Book</span>
              </button>
            )}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-xs text-bt-muted">
                  <span className="text-bt-text font-medium">{user.username}</span>
                  {' · '}
                  <span className="text-bt-purple/70">{user.role}</span>
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-sm bg-bt-card border border-bt-border hover:border-bt-purple/50 text-bt-muted hover:text-bt-text px-3 py-2 rounded-full transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 text-sm bg-bt-purple hover:bg-bt-violet text-white px-4 py-2 rounded-full transition-colors font-medium"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}
