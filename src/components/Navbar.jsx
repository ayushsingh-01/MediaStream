import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentQuery = searchParams.get('q') || ''
  const [draftQuery, setDraftQuery] = useState(currentQuery)

  useEffect(() => {
    setDraftQuery(currentQuery)
  }, [currentQuery])

  const updateSearchParams = (nextQuery) => {
    const params = new URLSearchParams(searchParams)
    if (nextQuery) {
      params.set('q', nextQuery)
    } else {
      params.delete('q')
    }
    params.delete('pageToken')
    params.delete('page')
    setSearchParams(params)
  }

  return (
    <header className="navbar">
      <div className="navbar-content">
        <span className="navbar-title">Sasta youtube</span>
        <form
          className="navbar-search"
          onSubmit={(event) => {
            event.preventDefault()
            updateSearchParams(draftQuery.trim())
          }}
        >
          <input
            type="search"
            value={draftQuery}
            onChange={(event) => setDraftQuery(event.target.value)}
            placeholder="Search YouTube"
            aria-label="Search YouTube"
          />
          <button type="submit">Search</button>
        </form>
      </div>
    </header>
  )
}
