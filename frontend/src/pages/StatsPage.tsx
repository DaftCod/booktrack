import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, Users, Tag, Star } from 'lucide-react'
import { fetchBooks } from '../api/books'

export default function StatsPage() {
  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  })

  const stats = useMemo(() => {
    if (!books.length) return null

    const authorSet = new Set(books.flatMap(b => b.authors.map(a => a.id)))
    const genreSet = new Set(books.flatMap(b => b.genres.map(g => g.id)))

    const genreCount: Record<string, number> = {}
    for (const book of books) {
      for (const g of book.genres) {
        genreCount[g.name] = (genreCount[g.name] ?? 0) + 1
      }
    }
    const topGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 8)

    const topRated = [...books]
      .filter(b => b.averageRating > 0)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5)

    const decadeCount: Record<string, number> = {}
    for (const book of books) {
      if (book.publishedYear) {
        const decade = `${Math.floor(book.publishedYear / 10) * 10}s`
        decadeCount[decade] = (decadeCount[decade] ?? 0) + 1
      }
    }
    const decades = Object.entries(decadeCount).sort((a, b) => a[0].localeCompare(b[0]))

    const rated = books.filter(b => b.averageRating > 0)
    const avgRating = rated.length
      ? rated.reduce((sum, b) => sum + b.averageRating, 0) / rated.length
      : 0

    return { authorCount: authorSet.size, genreCount: genreSet.size, topGenres, topRated, decades, avgRating }
  }, [books])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 flex justify-center">
        <div className="h-8 w-8 border-2 border-bt-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-bt-muted">No data yet.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-bt-text mb-8">Library Stats</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { icon: BookOpen, label: 'Books', value: books.length, color: 'text-bt-purple' },
          { icon: Users, label: 'Authors', value: stats.authorCount, color: 'text-bt-violet' },
          { icon: Tag, label: 'Genres', value: stats.genreCount, color: 'text-cyan-400' },
          { icon: Star, label: 'Avg Rating', value: stats.avgRating.toFixed(2), color: 'text-amber-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-bt-card border border-bt-border rounded-xl p-4 flex flex-col gap-2">
            <Icon className={`h-5 w-5 ${color}`} />
            <p className="text-2xl font-bold text-bt-text">{value}</p>
            <p className="text-xs text-bt-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-bt-card border border-bt-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-bt-text mb-4">Books by Genre</h2>
          <div className="flex flex-col gap-2.5">
            {stats.topGenres.map(([name, count]) => (
              <div key={name} className="flex items-center gap-3">
                <span className="text-xs text-bt-muted w-28 shrink-0 truncate">{name}</span>
                <div className="flex-1 bg-bt-surface rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-bt-purple rounded-full"
                    style={{ width: `${(count / books.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-bt-muted w-4 text-right shrink-0">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-bt-card border border-bt-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-bt-text mb-4">Top Rated</h2>
          <div className="flex flex-col gap-3">
            {stats.topRated.map((book, i) => (
              <div key={book.id} className="flex items-center gap-3">
                <span className="text-xs text-bt-muted/50 w-4 text-center shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-bt-text font-medium truncate">{book.title}</p>
                  <p className="text-[11px] text-bt-muted truncate">
                    {book.authors.map(a => a.fullName).join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-amber-400 text-xs">★</span>
                  <span className="text-xs font-semibold text-bt-text">{book.averageRating.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {stats.decades.length > 0 && (
          <div className="bg-bt-card border border-bt-border rounded-xl p-5 lg:col-span-2">
            <h2 className="text-sm font-semibold text-bt-text mb-4">Books by Decade</h2>
            <div className="flex items-end gap-3 h-28">
              {stats.decades.map(([decade, count]) => {
                const maxCount = Math.max(...stats.decades.map(d => d[1]))
                return (
                  <div key={decade} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                    <span className="text-[10px] text-bt-muted">{count}</span>
                    <div
                      className="w-full bg-bt-purple/60 hover:bg-bt-purple rounded-t transition-colors"
                      style={{ height: `${(count / maxCount) * 72}px` }}
                    />
                    <span className="text-[9px] text-bt-muted/60 truncate w-full text-center">{decade}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
