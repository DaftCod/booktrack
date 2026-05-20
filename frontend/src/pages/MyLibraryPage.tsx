import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BookOpen, Trash2, Loader, BookMarked, Clock, CheckCircle2 } from 'lucide-react'
import { fetchUserBooks, removeUserBook } from '../api/userBooks'
import { useAuth } from '../contexts/AuthContext'
import { ReadingStatusLabel } from '../types/userBook'
import type { ReadingStatus, UserBookDto } from '../types/userBook'

const STATUS_ORDER: ReadingStatus[] = ['Reading', 'WantToRead', 'Read']

const STATUS_CONFIG: Record<ReadingStatus, {
  label: string
  color: string
  border: string
  badge: string
  Icon: React.ElementType
}> = {
  Reading: {
    label: 'Currently Reading',
    color: 'text-blue-400',
    border: 'border-blue-700/30',
    badge: 'bg-blue-900/30 text-blue-300',
    Icon: BookMarked,
  },
  WantToRead: {
    label: 'Want to Read',
    color: 'text-amber-400',
    border: 'border-amber-700/30',
    badge: 'bg-amber-900/30 text-amber-300',
    Icon: Clock,
  },
  Read: {
    label: 'Read',
    color: 'text-emerald-400',
    border: 'border-emerald-700/30',
    badge: 'bg-emerald-900/30 text-emerald-300',
    Icon: CheckCircle2,
  },
}

const TABS: { status: ReadingStatus | 'all'; label: string }[] = [
  { status: 'all', label: 'All' },
  { status: 'Reading', label: 'Reading' },
  { status: 'WantToRead', label: 'Want to Read' },
  { status: 'Read', label: 'Read' },
]

function UserBookCard({
  ub,
  onRemove,
  removing,
}: {
  ub: UserBookDto
  onRemove: (bookId: string) => void
  removing: boolean
}) {
  const [imgError, setImgError] = useState(false)
  const coverSrc = !imgError && ub.coverImageUrl ? ub.coverImageUrl : null
  const cfg = STATUS_CONFIG[ub.status as ReadingStatus]

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
        {cfg && (
          <span className={`inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.badge}`}>
            {ReadingStatusLabel[ub.status as ReadingStatus]}
          </span>
        )}
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

function StatusSection({
  status,
  books,
  onRemove,
  pendingBookId,
}: {
  status: ReadingStatus
  books: UserBookDto[]
  onRemove: (bookId: string) => void
  pendingBookId: string | undefined
}) {
  if (!books.length) return null
  const { label, color, border, Icon } = STATUS_CONFIG[status]

  return (
    <section className="mb-8">
      <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${border}`}>
        <Icon className={`h-4 w-4 ${color}`} />
        <h2 className={`text-sm font-semibold ${color}`}>{label}</h2>
        <span className="text-xs text-bt-muted/60 ml-1">{books.length}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {books.map(ub => (
          <UserBookCard
            key={ub.id}
            ub={ub}
            onRemove={onRemove}
            removing={pendingBookId === ub.bookId}
          />
        ))}
      </div>
    </section>
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

  const counts = {
    all: userBooks.length,
    Reading: userBooks.filter(ub => ub.status === 'Reading').length,
    WantToRead: userBooks.filter(ub => ub.status === 'WantToRead').length,
    Read: userBooks.filter(ub => ub.status === 'Read').length,
  }

  const sortedFiltered = (books: UserBookDto[]) =>
    [...books].sort((a, b) => a.title.localeCompare(b.title))

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

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-bt-card border border-bt-border rounded-xl p-1 w-fit overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={String(tab.status)}
            onClick={() => setActiveTab(tab.status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
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

      {/* All tab — grouped by status */}
      {!isLoading && activeTab === 'all' && (
        <>
          {userBooks.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-12 w-12 text-bt-muted/30 mx-auto mb-3" />
              <p className="text-bt-muted">Your library is empty. Browse books to add some!</p>
            </div>
          ) : (
            STATUS_ORDER.map(status => (
              <StatusSection
                key={status}
                status={status}
                books={sortedFiltered(userBooks.filter(ub => ub.status === status))}
                onRemove={bookId => removeMutation.mutate(bookId)}
                pendingBookId={removeMutation.isPending ? removeMutation.variables : undefined}
              />
            ))
          )}
        </>
      )}

      {/* Filtered tab */}
      {!isLoading && activeTab !== 'all' && (() => {
        const books = sortedFiltered(userBooks.filter(ub => ub.status === activeTab))
        if (!books.length) {
          return (
            <div className="text-center py-20">
              <BookOpen className="h-12 w-12 text-bt-muted/30 mx-auto mb-3" />
              <p className="text-bt-muted">No books in this category.</p>
            </div>
          )
        }
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {books.map(ub => (
              <UserBookCard
                key={ub.id}
                ub={ub}
                onRemove={bookId => removeMutation.mutate(bookId)}
                removing={removeMutation.isPending && removeMutation.variables === ub.bookId}
              />
            ))}
          </div>
        )
      })()}
    </div>
  )
}
