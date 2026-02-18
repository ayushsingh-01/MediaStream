import React, { useEffect, useState } from 'react'

export default function Pagination({
  currentPage = 1,
  hasPrev = false,
  hasNext = false,
  isLoading = false,
  onPrev,
  onNext,
}) {
  const [page, setPage] = useState(currentPage)

  useEffect(() => {
    setPage(currentPage)
  }, [currentPage])

  const handlePrev = () => {
    if (!hasPrev || isLoading) return
    const nextPage = Math.max(1, page - 1)
    setPage(nextPage)
    onPrev?.()
  }

  const handleNext = () => {
    if (!hasNext || isLoading) return
    const nextPage = page + 1
    setPage(nextPage)
    onNext?.()
  }

  return (
    <div className="pagination" role="navigation" aria-label="Pagination">
      <button
        type="button"
        className="pagination-button"
        onClick={handlePrev}
        disabled={!hasPrev || isLoading}
      >
        Prev
      </button>
      <span className="pagination-status">Page {page}</span>
      <button
        type="button"
        className="pagination-button"
        onClick={handleNext}
        disabled={!hasNext || isLoading}
      >
        Next
      </button>
    </div>
  )
}
