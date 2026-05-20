export interface AuthorDto {
  id: string
  fullName: string
}

export interface GenreDto {
  id: string
  name: string
}

export interface BookDto {
  id: string
  title: string
  isbn: string | null
  publishedYear: number | null
  description: string | null
  coverImageUrl: string | null
  pageCount: number | null
  averageRating: number
  authors: AuthorDto[]
  genres: GenreDto[]
}
