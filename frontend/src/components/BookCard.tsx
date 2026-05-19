import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import type { BookDto } from '../types/book'
import GenreBadge from './GenreBadge'
import StarRating from './StarRating'

interface BookCardProps {
  book: BookDto
  onClick?: (book: BookDto) => void
}

export default function BookCard({ book, onClick }: BookCardProps) {
  const [imgError, setImgError] = useState(false)
  const coverSrc = !imgError && book.coverImageUrl ? book.coverImageUrl : null

  return (
    <article
      onClick={() => onClick?.(book)}
      className="group flex flex-col rounded-xl overflow-hidden bg-bt-card border border-bt-border hover:border-bt-purple/60 transition-all duration-300 hover:shadow-xl hover:shadow-bt-purple/10 hover:-translate-y-1 cursor-pointer"
    >
      {/* Cover */}
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
        {/* Rating overlay */}
        {book.averageRating > 0 && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
            <span className="text-amber-400 text-[10px]">★</span>
            <span className="text-white text-[10px] font-semibold">{book.averageRating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <h3 className="text-sm font-semibold text-bt-text leading-tight line-clamp-2">
          {book.title}
        </h3>
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
