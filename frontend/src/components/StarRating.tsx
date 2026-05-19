import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  max?: number
}

export default function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'text-gray-600'
          }`}
        />
      ))}
      <span className="ml-1 text-[11px] text-bt-muted font-medium">{rating.toFixed(1)}</span>
    </div>
  )
}
