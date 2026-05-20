import { useState } from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  max?: number
  onChange?: (rating: number) => void
}

export default function StarRating({ rating, max = 5, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const display = hovered || rating

  if (!onChange) {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`}
          />
        ))}
        <span className="ml-1 text-[11px] text-bt-muted font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHovered(0)}>
      {Array.from({ length: max }, (_, i) => {
        const value = i + 1
        return (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHovered(value)}
            onClick={() => onChange(value)}
            className="focus:outline-none"
          >
            <Star
              className={`h-5 w-5 transition-colors ${
                value <= display ? 'fill-amber-400 text-amber-400' : 'text-gray-600 hover:text-amber-300'
              }`}
            />
          </button>
        )
      })}
      {rating > 0 && (
        <span className="ml-1 text-xs text-bt-muted">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}
