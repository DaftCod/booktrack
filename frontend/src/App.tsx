import { useState } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import BrowsePage from './pages/BrowsePage'
import MyLibraryPage from './pages/MyLibraryPage'
import StatsPage from './pages/StatsPage'
import AddBookModal from './components/AddBookModal'

type Page = 'browse' | 'library' | 'stats'

function AppContent() {
  const [page, setPage] = useState<Page>('browse')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddBook, setShowAddBook] = useState(false)
  const { isAdmin } = useAuth()

  return (
    <div className="min-h-screen bg-bt-bg text-bt-text">
      <Header
        page={page}
        onNavigate={setPage}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onAddBook={() => setShowAddBook(true)}
      />
      {page === 'browse' && <BrowsePage searchQuery={searchQuery} />}
      {page === 'library' && <MyLibraryPage />}
      {page === 'stats' && <StatsPage />}
      {showAddBook && isAdmin && <AddBookModal onClose={() => setShowAddBook(false)} />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
