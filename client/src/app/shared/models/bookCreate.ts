export interface BookCreate {
    name: string
    rating: number
    author: string
    genre: string
    isBookAvailable: boolean
    description: string
    lentByUserId: number | null
    currentlyBorrowedByUserId: number | null
  }
  