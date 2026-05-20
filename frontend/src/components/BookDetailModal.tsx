import { useState } from 'react'
import { X, BookOpen, Calendar, BookMarked, Plus, Minus, Loader } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { BookDto } from '../types/book'
import type { ReadingStatus } from '../types/userBook'
import { ReadingStatusLabel } from '../types/userBook'
import { addUserBook, removeUserBook, rateUserBook } from '../api/userBooks'
import GenreBadge from './GenreBadge'
import StarRating from './StarRating'
import { useAuth } from '../contexts/AuthContext'

interface BookDetailModalProps {
  book: BookDto
  onClose: () => void
  inLibrary?: boolean
  currentStatus?: ReadingStatus
  currentRating?: number | null
}

export default function BookDetailModal({ book, onClose, inLibrary, currentStatus, currentRating }: BookDetailModalProps) {
  const [imgError, setImgError] = useState(false)
  const [status, setStatus] = useState<ReadingStatus>(currentStatus ?? 'WantToRead')
  const [userRating, setUserRating] = useState<number>(currentRating ?? 0)
  const coverSrc = !imgError && book.coverImageUrl ? book.coverImageUrl : null
  const { user } = useAuth()
  const qc = useQueryClient()

  const addMutation = useMutation({
    mutationFn: () => addUserBook(book.id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['userBooks'] })
      onClose()
    },
  })

  const removeMutation = useMutation({
    mutationFn: () => removeUserBook(book.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['userBooks'] })
      onClose()
    },
  })

  const rateMutation = useMutation({
    mutationFn: (rating: number) => rateUserBook(book.id, rating),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['userBooks', 'books'] }),
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-bt-card border border-bt-border rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-bt-surface hover:bg-bt-border rounded-full p-1.5 transition-colors"
        >
          <X className="h-4 w-4 text-bt-muted" />
        </button>

        <div className="flex flex-col sm:flex-row max-h-[85vh] sm:max-h-[80vh]">
          <div className="sm:w-48 flex-shrink-0 bg-bt-surface">
            {coverSrc ? (
              <img
                src={coverSrc}
                alt={book.title}
                onError={() => setImgError(true)}
                className="w-full h-64 sm:h-full object-cover"
              />
            ) : (
              <div className="w-full h-64 sm:h-full flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-bt-purple/30" />
              </div>
            )}
          </div>

          <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
            <div>
              <h2 className="text-xl font-bold text-bt-text leading-tight">{book.title}</h2>
              <p className="text-sm text-bt-muted mt-1">
                {book.authors.map(a => a.fullName).join(', ')}
              </p>
            </div>

            <StarRating rating={book.averageRating} max={5} />

            <div className="flex flex-wrap gap-1.5">
              {book.genres.map(g => (
                <GenreBadge key={g.id} genre={g.name} size="md" />
              ))}
            </div>

            {book.description && (
              <p className="text-sm text-bt-muted leading-relaxed">{book.description}</p>
            )}

            <div className="flex flex-wrap gap-4 text-xs text-bt-muted">
              {book.publishedYear && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {book.publishedYear}
                </span>
              )}
              {book.pageCount && (
                <span className="flex items-center gap-1">
                  <BookMarked className="h-3.5 w-3.5" />
                  {book.pageCount} pages
                </span>
              )}
              {book.isbn && (
                <span className="font-mono text-[10px]">ISBN {book.isbn}</span>
              )}
            </div>

            <div className="mt-auto flex flex-col gap-2">
              {!user ? (
                <p className="text-xs text-center text-bt-muted py-2">Sign in to add to your library</p>
              ) : inLibrary ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="flex-1 bg-bt-surface border border-bt-purple/40 rounded-xl px-3 py-2.5 text-sm text-bt-purple font-medium">
                      {ReadingStatusLabel[currentStatus ?? 'WantToRead']}
                    </div>
                    <button
                      onClick={() => removeMutation.mutate()}
                      disabled={removeMutation.isPending}
                      className="bg-red-900/30 hover:bg-red-900/50 border border-red-800/40 text-red-400 text-sm px-3 py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {removeMutation.isPending
                        ? <Loader className="h-4 w-4 animate-spin" />
                        : <Minus className="h-4 w-4" />}
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-xs text-bt-muted">Your rating:</span>
                    <StarRating
                      rating={userRating}
                      onChange={r => {
                        setUserRating(r)
                        rateMutation.mutate(r)
                      }}
                    />
                    {rateMutation.isPending && <Loader className="h-3 w-3 text-bt-muted animate-spin" />}
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as ReadingStatus)}
                    className="flex-1 bg-bt-surface border border-bt-border text-bt-text text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-bt-purple cursor-pointer"
                  >
                    {(['WantToRead', 'Reading', 'Read'] as ReadingStatus[]).map(s => (
                      <option key={s} value={s}>{ReadingStatusLabel[s]}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => addMutation.mutate()}
                    disabled={addMutation.isPending}
                    className="flex-1 bg-bt-purple hover:bg-bt-violet disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {addMutation.isPending
                      ? <Loader className="h-4 w-4 animate-spin" />
                      : <Plus className="h-4 w-4" />}
                    Add to Library
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
