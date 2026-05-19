const GENRE_STYLES: Record<string, string> = {
  'Fantasy':          'bg-violet-900/50 text-violet-200 border-violet-700/40',
  'Science Fiction':  'bg-blue-900/50 text-blue-200 border-blue-700/40',
  'Romance':          'bg-pink-900/50 text-pink-200 border-pink-700/40',
  'Historical Fiction':'bg-amber-900/50 text-amber-200 border-amber-700/40',
  'Classic':          'bg-emerald-900/50 text-emerald-200 border-emerald-700/40',
  'Cozy Fantasy':     'bg-teal-900/50 text-teal-200 border-teal-700/40',
  'Comedy':           'bg-yellow-900/50 text-yellow-200 border-yellow-700/40',
  'Literary Fiction': 'bg-indigo-900/50 text-indigo-200 border-indigo-700/40',
}

const DEFAULT_STYLE = 'bg-bt-surface text-bt-muted border-bt-border'

interface GenreBadgeProps {
  genre: string
  size?: 'sm' | 'md'
}

export default function GenreBadge({ genre, size = 'sm' }: GenreBadgeProps) {
  const style = GENRE_STYLES[genre] ?? DEFAULT_STYLE
  const sizeClass = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[10px]'
  return (
    <span className={`${sizeClass} rounded-full border font-medium leading-none ${style}`}>
      {genre}
    </span>
  )
}
