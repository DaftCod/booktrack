import axios from 'axios'
import type { BookDto } from '../types/book'

export const fetchBooks = (): Promise<BookDto[]> =>
  axios.get<BookDto[]>('/api/books').then(r => r.data)

export const fetchBook = (id: string): Promise<BookDto> =>
  axios.get<BookDto>(`/api/books/${id}`).then(r => r.data)
