import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BookOpen, Trash2, Loader } from 'lucide-react'
import { fetchUserBooks, removeUserBook } from '../api/userBooks'
import { useAuth } from '../contexts/AuthContext'
import { ReadingStatusLabel } from '../types/userBook'
import type { ReadingStatus, UserBookDto } from '../types/userBook'

const TABS: { status: ReadingStatus | 'all'; label: string }[] = [
  { status: 'all', label: 'All' },
  { status: 'WantToRead', label: 'Want to Read' },
  { status: 'Reading', label: 'Reading' },
  { status: 'Read', label: 'Read' },
]

function UserBookCard({ ub, onRemove, removing }: { ub: UserBookDto; onRemove: (id: string) => void; removing: boolean }) {
  const [imgError, setImgError] = useState(false)
  const coverSrc = !imgError && ub.coverImageUrl ? ub.coverImageUrl : null

  return (
    <div className="flex gap-3 p-3 rounded-xl border border-bt-border bg-bt-card hover:border-bt-purple/40 transition-colors group">
      <div className="w-12 flex-shrink-0 aspect-[2/3] rounded overflow-hidden bg-bt-surface">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={ub.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-bt-muted/30" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-bt-text leading-tight line-clamp-2">{ub.title}</p>
        <p className="text-[11px] text-bt-muted mt-0.5 line-clamp-1">
          {ub.authors.map(a => a.fullName).join(', ')}
        </p>
        <span className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-bt-purple/20 text-bt-purple">
          {ReadingStatusLabel[ub.status as ReadingStatus]}
        </span>
      </div>
      <button
        onClick={() => onRemove(ub.bookId)}
        disabled={removing}
        className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-bt-muted hover:text-red-400 disabled:opacity-50 transition-all self-start mt-1"
        title="Remove from library"
      >
        {removing ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>
    </div>
  )
}

export default function MyLibraryPage() {
  const [activeTab, setActiveTab] = useState<ReadingStatus | 'all'>('all')
  const { user } = useAuth()
  const qc = useQueryClient()

  const { data: userBooks = [], isLoading } = useQuery({
    queryKey: ['userBooks'],
    queryFn: fetchUserBooks,
    enabled: !!user,
  })

  const removeMutation = useMutation({
    mutationFn: removeUserBook,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['userBooks'] }),
  })

  const filtered = activeTab === 'all'
    ? userBooks
    : userBooks.filter(ub => ub.status === activeTab)

  const counts = {
    all: userBooks.length,
    WantToRead: userBooks.filter(ub => ub.status === 'WantToRead').length,
    Reading: userBooks.filter(ub => ub.status === 'Reading').length,
    Read: userBooks.filter(ub => ub.status === 'Read').length,
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <BookOpen className="h-16 w-16 text-bt-purple/30 mx-auto mb-4" />
        <p className="text-bt-muted text-lg">Sign in to see your library</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-bt-text">My Library</h1>
        <span className="text-sm text-bt-muted">{userBooks.length} books</span>
      </div>

      <div className="flex gap-1 mb-6 bg-bt-card border border-bt-border rounded-xl p-1 w-fit">
        {TABS.map(tab => (
          <button
            key={String(tab.status)}
            onClick={() => setActiveTab(tab.status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.status ? 'bg-bt-purple text-white' : 'text-bt-muted hover:text-bt-text'
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-[11px] ${activeTab === tab.status ? 'text-white/70' : 'text-bt-muted/60'}`}>
              {counts[tab.status as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader className="h-8 w-8 text-bt-purple animate-spin" />
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-20">
          <BookOpen className="h-12 w-12 text-bt-muted/30 mx-auto mb-3" />
          <p className="text-bt-muted">
            {activeTab === 'all' ? 'Your library is empty. Browse books to add some!' : 'No books in this category.'}
          </p>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(ub => (
            <UserBookCard
              key={ub.id}
              ub={ub}
              onRemove={bookId => removeMutation.mutate(bookId)}
              removing={removeMutation.isPending && removeMutation.variables === ub.bookId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
