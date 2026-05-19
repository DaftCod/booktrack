import { useState } from 'react'
import { X, BookOpen, Calendar, BookMarked } from 'lucide-react'
import type { BookDto } from '../types/book'
import GenreBadge from './GenreBadge'
import StarRating from './StarRating'

interface BookDetailModalProps {
  book: BookDto
  onClose: () => void
}

export default function BookDetailModal({ book, onClose }: BookDetailModalProps) {
  const [imgError, setImgError] = useState(false)
  const coverSrc = !imgError && book.coverImageUrl ? book.coverImageUrl : null

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

        <div className="flex flex-col sm:flex-row gap-0">
          {/* Cover */}
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

          {/* Details */}
          <div className="flex-1 p-6 flex flex-col gap-4">
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
              <p className="text-sm text-bt-muted leading-relaxed line-clamp-3">
                {book.description}
              </p>
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

            <button className="mt-auto w-full bg-bt-purple hover:bg-bt-violet text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
              Add to Library
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
