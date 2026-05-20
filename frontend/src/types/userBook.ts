import type { AuthorDto } from './book'

export type ReadingStatus = 'WantToRead' | 'Reading' | 'Read'

export const ReadingStatusLabel: Record<ReadingStatus, string> = {
  WantToRead: 'Want to Read',
  Reading: 'Reading',
  Read: 'Read',
}

export const ReadingStatusColor: Record<ReadingStatus, string> = {
  WantToRead: 'text-amber-300 bg-amber-900/40 border-amber-700/40',
  Reading: 'text-blue-300 bg-blue-900/40 border-blue-700/40',
  Read: 'text-emerald-300 bg-emerald-900/40 border-emerald-700/40',
}

export interface UserBookDto {
  id: string
  bookId: string
  title: string
  coverImageUrl: string | null
  authors: AuthorDto[]
  status: ReadingStatus
  addedAt: string
  rating: number | null
}
