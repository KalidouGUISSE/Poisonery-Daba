export type PaginationInput = {
  page: number
  limit: number
}

export function getPagination({ page, limit }: PaginationInput, total: number) {
  const totalPages = Math.ceil(total / limit)
  return {
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

export function getSkip(page: number, limit: number) {
  return (page - 1) * limit
}
