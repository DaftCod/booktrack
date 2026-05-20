import axios from 'axios'
import type { UserBookDto, ReadingStatus } from '../types/userBook'

export const fetchUserBooks = (): Promise<UserBookDto[]> =>
  axios.get<UserBookDto[]>('/api/user/books').then(r => r.data)

export const addUserBook = (bookId: string, status: ReadingStatus): Promise<UserBookDto> =>
  axios.post<UserBookDto>('/api/user/books', { bookId, status }).then(r => r.data)

export const removeUserBook = (bookId: string): Promise<void> =>
  axios.delete(`/api/user/books/${bookId}`).then(() => undefined)

export const rateUserBook = (bookId: string, rating: number): Promise<void> =>
  axios.put(`/api/user/books/${bookId}/rating`, { rating }).then(() => undefined)
