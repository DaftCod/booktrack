import { useState } from 'react'
import { X, Search, Plus, Loader, BookOpen } from 'lucide-react'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { BookDto } from '../types/book'

interface OLDoc {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  isbn?: string[]
  cover_i?: number
  number_of_pages_median?: number
}

interface AddBookModalProps {
  onClose: () => void
}

export default function AddBookModal({ onClose }: AddBookModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<OLDoc[]>([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<OLDoc | null>(null)
  const [genres, setGenres] = useState('')
  const [error, setError] = useState('')
  const qc = useQueryClient()

  const search = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    setResults([])
    setSelected(null)
    try {
      const { data } = await axios.get('https://openlibrary.org/search.json', {
        params: {
          q: query,
          fields: 'key,title,author_name,first_publish_year,isbn,cover_i,number_of_pages_median',
          limit: 8,
        },
      })
      setResults(data.docs ?? [])
    } catch {
      setError('Could not reach Open Library. Check your connection.')
    } finally {
      setSearching(false)
    }
  }

  const addMutation = useMutation({
    mutationFn: (doc: OLDoc) => {
      const isbn = doc.isbn?.[0] ?? null
      return axios.post<BookDto>('/api/books', {
        title: doc.title,
        isbn,
        publishedYear: doc.first_publish_year ?? null,
        coverImageUrl: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
          : isbn
            ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
            : null,
        pageCount: doc.number_of_pages_median ?? null,
        authorNames: doc.author_name ?? [],
        genreNames: genres.split(',').map(g => g.trim()).filter(Boolean),
      }).then(r => r.data)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['books'] })
      onClose()
    },
    onError: () => setError('Failed to add book. The book may already exist.'),
  })

  const coverUrl = (doc: OLDoc) =>
    doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-bt-card border border-bt-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-bt-border">
          <h2 className="font-bold text-bt-text">Add Book to Collection</h2>
          <button onClick={onClose} className="text-bt-muted hover:text-bt-text transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <form onSubmit={search} className="p-4 border-b border-bt-border flex gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Open Library — title, author, ISBN…"
            className="flex-1 bg-bt-surface border border-bt-border rounded-lg px-3 py-2 text-sm text-bt-text placeholder:text-bt-muted focus:outline-none focus:border-bt-purple transition-colors"
          />
          <button
            type="submit"
            disabled={searching}
            className="bg-bt-purple hover:bg-bt-violet disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            {searching ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </button>
        </form>

        {/* Results */}
        <div className="overflow-y-auto flex-1 p-4">
          {results.length > 0 && !selected && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {results.map(doc => (
                <button
                  key={doc.key}
                  onClick={() => setSelected(doc)}
                  className="flex flex-col items-center gap-2 p-2 rounded-xl border border-bt-border hover:border-bt-purple/60 bg-bt-surface hover:bg-bt-surface/80 transition-all text-left group"
                >
                  <div className="w-full aspect-[2/3] bg-bt-card rounded overflow-hidden">
                    {coverUrl(doc) ? (
                      <img src={coverUrl(doc)!} alt={doc.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-bt-muted/30" />
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <p className="text-[11px] font-semibold text-bt-text line-clamp-2 leading-tight">{doc.title}</p>
                    <p className="text-[10px] text-bt-muted mt-0.5 line-clamp-1">
                      {doc.author_name?.slice(0, 2).join(', ') ?? ''}
                    </p>
                    {doc.first_publish_year && (
                      <p className="text-[10px] text-bt-muted/60">{doc.first_publish_year}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.length === 0 && !searching && query && (
            <p className="text-center text-bt-muted text-sm py-8">No results found.</p>
          )}

          {/* Selected book confirmation */}
          {selected && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 p-4 bg-bt-surface rounded-xl border border-bt-purple/40">
                <div className="w-20 flex-shrink-0 aspect-[2/3] rounded overflow-hidden bg-bt-card">
                  {coverUrl(selected) ? (
                    <img src={coverUrl(selected)!} alt={selected.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-bt-muted/30" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-bt-text">{selected.title}</h3>
                  <p className="text-sm text-bt-muted mt-0.5">{selected.author_name?.join(', ')}</p>
                  {selected.first_publish_year && (
                    <p className="text-xs text-bt-muted/60 mt-0.5">{selected.first_publish_year}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-bt-muted mb-1.5">
                  Genres <span className="text-bt-muted/60">(comma-separated, e.g. Fantasy, Romance)</span>
                </label>
                <input
                  value={genres}
                  onChange={e => setGenres(e.target.value)}
                  placeholder="Fantasy, Science Fiction…"
                  className="w-full bg-bt-surface border border-bt-border rounded-lg px-3 py-2 text-sm text-bt-text placeholder:text-bt-muted focus:outline-none focus:border-bt-purple transition-colors"
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">{error}</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => { setSelected(null); setError('') }}
                  className="flex-1 bg-bt-surface hover:bg-bt-border border border-bt-border text-bt-muted text-sm py-2.5 rounded-xl transition-colors"
                >
                  Back to results
                </button>
                <button
                  onClick={() => addMutation.mutate(selected)}
                  disabled={addMutation.isPending}
                  className="flex-1 bg-bt-purple hover:bg-bt-violet disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {addMutation.isPending
                    ? <Loader className="h-4 w-4 animate-spin" />
                    : <Plus className="h-4 w-4" />}
                  Add to Collection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
