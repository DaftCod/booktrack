import { BookOpen, Search, User } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-bt-bg/95 backdrop-blur-sm border-b border-bt-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <BookOpen className="h-6 w-6 text-bt-purple" />
          <span className="text-lg font-bold tracking-tight text-bt-text">BookTrack</span>
        </div>

        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bt-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search books, authors…"
              className="w-full pl-9 pr-4 py-2 rounded-full bg-bt-card border border-bt-border text-sm text-bt-text placeholder:text-bt-muted focus:outline-none focus:border-bt-purple transition-colors"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-bt-muted">
          <a href="#" className="hover:text-bt-text transition-colors font-medium text-bt-purple">Browse</a>
          <a href="#" className="hover:text-bt-text transition-colors">My Library</a>
          <a href="#" className="hover:text-bt-text transition-colors">Stats</a>
        </nav>

        <button className="flex items-center gap-2 text-sm bg-bt-purple hover:bg-bt-violet text-white px-4 py-2 rounded-full transition-colors font-medium shrink-0">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Sign In</span>
        </button>
      </div>
    </header>
  )
}
