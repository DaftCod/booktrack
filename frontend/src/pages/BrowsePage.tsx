import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { fetchBooks } from '../api/books'
import { fetchUserBooks } from '../api/userBooks'
import { useAuth } from '../contexts/AuthContext'
import BookCard from '../components/BookCard'
import BookDetailModal from '../components/BookDetailModal'
import type { BookDto } from '../types/book'

interface BrowsePageProps {
  searchQuery: string
}

const SORT_OPTIONS = [
  { value: 'title', label: 'Title' },
  { value: 'rating', label: 'Rating' },
  { value: 'year', label: 'Year' },
]

export default function BrowsePage({ searchQuery }: BrowsePageProps) {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('rating')
  const [selectedBook, setSelectedBook] = useState<BookDto | null>(null)
  const { user, isAdmin } = useAuth()
  const qc = useQueryClient()

  const { data: books = [], isLoading, isError } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  })

  const { data: userBooks = [] } = useQuery({
    queryKey: ['userBooks'],
    queryFn: fetchUserBooks,
    enabled: !!user,
  })

  const libraryMap = useMemo(
    () => new Map(userBooks.map(ub => [ub.bookId, ub])),
    [userBooks]
  )

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/books/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
  })

  const genres = useMemo(
    () => [...new Set(books.flatMap(b => b.genres.map(g => g.name)))].sort(),
    [books]
  )

  const filtered = useMemo(() => {
    let list = books
    if (selectedGenre) list = list.filter(b => b.genres.some(g => g.name === selectedGenre))
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.authors.some(a => a.fullName.toLowerCase().includes(q))
      )
    }
    return [...list].sort((a, b) => {
      if (sortBy === 'rating') return b.averageRating - a.averageRating
      if (sortBy === 'year') return (b.publishedYear ?? 0) - (a.publishedYear ?? 0)
      return a.title.localeCompare(b.title)
    })
  }, [books, selectedGenre, searchQuery, sortBy])

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bt-purple/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-bt-text">Discover Your Next Read</h1>
          <p className="mt-2 text-bt-muted text-lg">
            {books.length > 0 ? `${books.length} books in the library` : 'Your personal reading universe'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGenre(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedGenre === null
                  ? 'bg-bt-purple text-white'
                  : 'bg-bt-card border border-bt-border text-bt-muted hover:text-bt-text hover:border-bt-purple/50'
              }`}
            >
              All
            </button>
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre === selectedGenre ? null : genre)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedGenre === genre
                    ? 'bg-bt-purple text-white'
                    : 'bg-bt-card border border-bt-border text-bt-muted hover:text-bt-text hover:border-bt-purple/50'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-bt-card border border-bt-border text-bt-muted text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-bt-purple cursor-pointer shrink-0"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="rounded-xl bg-bt-card border border-bt-border overflow-hidden animate-pulse">
                <div className="aspect-[2/3] bg-bt-surface" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-bt-surface rounded w-3/4" />
                  <div className="h-2 bg-bt-surface rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-20">
            <p className="text-bt-muted text-lg">Failed to load books.</p>
            <p className="text-bt-muted/60 text-sm mt-1">Make sure the API is running.</p>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-bt-muted text-lg">No books match this filter.</p>
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <>
            <p className="text-xs text-bt-muted mb-4">
              {filtered.length} {filtered.length === 1 ? 'book' : 'books'}
              {selectedGenre ? ` in ${selectedGenre}` : ''}
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  inLibrary={libraryMap.has(book.id)}
                  isAdmin={isAdmin}
                  onClick={setSelectedBook}
                  onDelete={id => deleteMutation.mutate(id)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          inLibrary={libraryMap.has(selectedBook.id)}
          currentStatus={libraryMap.get(selectedBook.id)?.status}
          currentRating={libraryMap.get(selectedBook.id)?.rating}
        />
      )}
    </>
  )
}
