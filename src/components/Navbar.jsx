import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SuggestionBox from './SuggestionBox'
import { addSearchHistory, loadSearchHistory } from '../utils/searchHistory'

export default function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const currentQuery = searchParams.get('q') || ''
  const [draftQuery, setDraftQuery] = useState(currentQuery)
  const [searchHistory, setSearchHistory] = useState(() => loadSearchHistory())
  const [isFocused, setIsFocused] = useState(false)

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
    navigate(`/search?${params.toString()}`)
  }

  const submitSearch = (value) => {
    const trimmed = value.trim()
    setSearchHistory(addSearchHistory(trimmed))
    updateSearchParams(trimmed)
  }

  return (
    <header className="navbar">
      <div className="navbar-content">
        <span className="navbar-title">Sasta youtube</span>
        <form
          className="navbar-search"
          onSubmit={(event) => {
            event.preventDefault()
            submitSearch(draftQuery)
            setIsFocused(false)
          }}
        >
          <div className="search-input-wrap">
            <input
              type="search"
              value={draftQuery}
              onChange={(event) => setDraftQuery(event.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 100)}
              placeholder="Search YouTube"
              aria-label="Search YouTube"
            />
            <SuggestionBox
              suggestions={searchHistory}
              isOpen={isFocused && searchHistory.length > 0}
              onSelect={(value) => {
                setDraftQuery(value)
                submitSearch(value)
                setIsFocused(false)
              }}
            />
          </div>
          <button type="submit">Search</button>
        </form>
      </div>
    </header>
  )
}
