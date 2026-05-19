import type { AuthorDto } from './book'

export type ReadingStatus = 0 | 1 | 2

export const ReadingStatusLabel: Record<ReadingStatus, string> = {
  0: 'Want to Read',
  1: 'Reading',
  2: 'Read',
}

export const ReadingStatusColor: Record<ReadingStatus, string> = {
  0: 'text-amber-300 bg-amber-900/40 border-amber-700/40',
  1: 'text-blue-300 bg-blue-900/40 border-blue-700/40',
  2: 'text-emerald-300 bg-emerald-900/40 border-emerald-700/40',
}

export interface UserBookDto {
  id: string
  bookId: string
  title: string
  coverImageUrl: string | null
  authors: AuthorDto[]
  status: ReadingStatus
  addedAt: string
}
