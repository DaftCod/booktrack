import { useState } from 'react'
import { BookOpen, Trash2, X, Check } from 'lucide-react'
import type { BookDto } from '../types/book'
import GenreBadge from './GenreBadge'
import StarRating from './StarRating'

interface BookCardProps {
  book: BookDto
  inLibrary?: boolean
  isAdmin?: boolean
  onClick?: (book: BookDto) => void
  onDelete?: (bookId: string) => void
}

export default function BookCard({ book, inLibrary, isAdmin, onClick, onDelete }: BookCardProps) {
  const [imgError, setImgError] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const coverSrc = !imgError && book.coverImageUrl ? book.coverImageUrl : null

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setConfirmDelete(true)
  }

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(book.id)
    setConfirmDelete(false)
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    setConfirmDelete(false)
  }

  return (
    <article
      onClick={() => onClick?.(book)}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-bt-card border border-bt-border hover:border-bt-purple/60 transition-all duration-300 hover:shadow-xl hover:shadow-bt-purple/10 hover:-translate-y-1 cursor-pointer"
    >
      {isAdmin && !confirmDelete && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 bg-red-900/80 hover:bg-red-700 text-white rounded-full p-1.5 transition-all"
          title="Delete book"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}

      {isAdmin && confirmDelete && (
        <div
          className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center gap-2 p-3"
          onClick={e => e.stopPropagation()}
        >
          <p className="text-white text-xs text-center font-medium">Delete this book?</p>
          <p className="text-white/60 text-[10px] text-center leading-tight line-clamp-2">{book.title}</p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 bg-bt-surface hover:bg-bt-border text-bt-text text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              <X className="h-3 w-3" /> Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex items-center gap-1 bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              <Check className="h-3 w-3" /> Delete
            </button>
          </div>
        </div>
      )}

      {inLibrary && (
        <div className="absolute top-2 right-2 z-10 bg-bt-purple/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
          In Library
        </div>
      )}

      <div className="relative aspect-[2/3] overflow-hidden bg-bt-surface flex-shrink-0">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={book.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
            <BookOpen className="h-10 w-10 text-bt-purple/40" />
            <span className="text-[10px] text-bt-muted text-center leading-tight line-clamp-3">
              {book.title}
            </span>
          </div>
        )}
        {book.averageRating > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
            <span className="text-amber-400 text-[10px]">★</span>
            <span className="text-white text-[10px] font-semibold">{book.averageRating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <h3 className="text-sm font-semibold text-bt-text leading-tight line-clamp-2">{book.title}</h3>
        <p className="text-[11px] text-bt-muted leading-tight">
          {book.authors.map(a => a.fullName).join(', ')}
        </p>
        {book.publishedYear && (
          <p className="text-[10px] text-bt-muted/70">{book.publishedYear}</p>
        )}
        <StarRating rating={book.averageRating} />
        <div className="flex flex-wrap gap-1 mt-auto pt-1">
          {book.genres.slice(0, 2).map(g => (
            <GenreBadge key={g.id} genre={g.name} />
          ))}
        </div>
      </div>
    </article>
  )
}
