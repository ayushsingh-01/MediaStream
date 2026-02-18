import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchVideos } from '../api/youtube'
import Pagination from '../components/Pagination'

const DEFAULT_QUERY = ''

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || DEFAULT_QUERY
  const initialPageToken = searchParams.get('pageToken') || ''
  const initialPage = Number(searchParams.get('page') || '1')
  const [videos, setVideos] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [nextPageToken, setNextPageToken] = useState('')
  const [prevPageToken, setPrevPageToken] = useState('')
  const query = initialQuery
  const pageToken = initialPageToken
  const currentPage = Number.isNaN(initialPage) ? 1 : initialPage

  const updateSearchParams = ({ nextQuery, nextPageToken, nextPage }) => {
    const params = new URLSearchParams()
    if (nextQuery) {
      params.set('q', nextQuery)
    }
    if (nextPageToken) {
      params.set('pageToken', nextPageToken)
    }
    if (nextPage && nextPage > 1) {
      params.set('page', String(nextPage))
    }
    setSearchParams(params)
  }

  useEffect(() => {
    let isActive = true

    const loadVideos = async () => {
      const trimmedQuery = query.trim()
      if (!trimmedQuery) {
        setVideos([])
        setStatus('idle')
        setError('')
        return
      }

      setStatus('loading')
      setError('')

      try {
        const data = await searchVideos(trimmedQuery, { pageToken, maxResults: '12' })
        if (!isActive) return
        setVideos(data.items || [])
        setNextPageToken(data.nextPageToken || '')
        setPrevPageToken(data.prevPageToken || '')
        setStatus('ready')
      } catch (err) {
        if (!isActive) return
        setStatus('error')
        setError(err?.message || 'Unable to load videos')
      }
    }

    loadVideos()

    return () => {
      isActive = false
    }
  }, [query, pageToken])

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Search Results</h1>
        <p>Find videos across YouTube.</p>
      </header>

      {status === 'idle' && <p>Type a search to see results.</p>}
      {status === 'loading' && (
        <section className="video-grid shimmer-grid" aria-label="Loading videos">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="video-card shimmer-card" key={`shimmer-${index}`}>
              <div className="shimmer-thumb shimmer-animate" />
              <div className="shimmer-line shimmer-animate" />
              <div className="shimmer-line shimmer-animate short" />
            </div>
          ))}
        </section>
      )}
      {status === 'error' && <p>{error}</p>}

      {status === 'ready' && (
        <>
          <section className="video-grid">
            {videos.map((video, index) => {
              const videoId = video.id?.videoId || video.id
              const snippet = video.snippet || {}
              const thumbnail = snippet.thumbnails?.medium?.url
              return (
                <Link className="video-card" to={`/watch/${videoId}`} key={videoId || `search-${index}`}>
                  {thumbnail && (
                    <img
                      src={thumbnail}
                      alt={snippet.title}
                      loading="lazy"
                    />
                  )}
                  <div>
                    <h3>{snippet.title}</h3>
                    <p>{snippet.channelTitle}</p>
                  </div>
                </Link>
              )
            })}
          </section>
          <Pagination
            currentPage={currentPage}
            hasPrev={Boolean(prevPageToken)}
            hasNext={Boolean(nextPageToken)}
            isLoading={status === 'loading'}
            onPrev={() => {
              const nextPage = Math.max(1, currentPage - 1)
              updateSearchParams({
                nextQuery: query.trim(),
                nextPageToken: prevPageToken,
                nextPage,
              })
            }}
            onNext={() => {
              const nextPage = currentPage + 1
              updateSearchParams({
                nextQuery: query.trim(),
                nextPageToken: nextPageToken,
                nextPage,
              })
            }}
          />
        </>
      )}
    </div>
  )
}
