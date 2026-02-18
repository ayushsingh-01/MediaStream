import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getPopularVideos, searchVideos } from '../api/youtube'
import Pagination from '../components/Pagination'

const DEFAULT_QUERY = ''
const POPULAR_REGIONS = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IN', 'JP', 'KR', 'BR']

const shuffleVideos = (items) => {
  const list = [...items]
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list
}

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || DEFAULT_QUERY
  const initialPageToken = searchParams.get('pageToken') || ''
  const initialPage = Number(searchParams.get('page') || '1')
  const initialRegion = searchParams.get('region') || POPULAR_REGIONS[Math.floor(Math.random() * POPULAR_REGIONS.length)]
  const [query, setQuery] = useState(DEFAULT_QUERY)
  const [videos, setVideos] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [pageToken, setPageToken] = useState('')
  const [nextPageToken, setNextPageToken] = useState('')
  const [prevPageToken, setPrevPageToken] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [region, setRegion] = useState(initialRegion)

  useEffect(() => {
    setQuery(initialQuery)
    setPageToken(initialPageToken)
    setCurrentPage(Number.isNaN(initialPage) ? 1 : initialPage)
    if (!initialQuery) {
      setRegion(initialRegion)
    }
  }, [initialQuery, initialPage, initialPageToken, initialRegion])

  const updateSearchParams = ({ nextQuery, nextPageToken, nextPage, nextRegion }) => {
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
    if (!nextQuery && nextRegion) {
      params.set('region', nextRegion)
    }
    setSearchParams(params)
  }

  useEffect(() => {
    let isActive = true

    const loadVideos = async () => {
      setStatus('loading')
      setError('')

      try {
        const trimmedQuery = query.trim()
        const activeRegion = trimmedQuery.length > 0 ? null : region
        const data = trimmedQuery.length > 0
          ? await searchVideos(trimmedQuery, { pageToken, maxResults: '12' })
          : await getPopularVideos({
              regionCode: activeRegion,
              pageToken,
            })
        if (!isActive) return
        const items = data.items || []
        const resolvedItems = trimmedQuery.length > 0 || pageToken ? items : shuffleVideos(items)
        setVideos(resolvedItems)
        setNextPageToken(data.nextPageToken || '')
        setPrevPageToken(data.prevPageToken || '')
        if (!trimmedQuery && activeRegion) {
          updateSearchParams({
            nextQuery: '',
            nextPageToken: pageToken,
            nextPage: currentPage,
            nextRegion: activeRegion,
          })
        }
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
  }, [query, pageToken, region, currentPage])

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>MediaStream</h1>
        <p>Explore YouTube videos directly in MediaStream.</p>
      </header>

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
            {videos.map((video) => {
              const videoId = video.id?.videoId
              const snippet = video.snippet || {}
              const thumbnail = snippet.thumbnails?.medium?.url
              return (
                <Link className="video-card" to={`/watch/${videoId}`} key={videoId}>
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
              setPageToken(prevPageToken)
              setCurrentPage(nextPage)
              updateSearchParams({
                nextQuery: query.trim(),
                nextPageToken: prevPageToken,
                nextPage,
                nextRegion: region,
              })
            }}
            onNext={() => {
              const nextPage = currentPage + 1
              setPageToken(nextPageToken)
              setCurrentPage(nextPage)
              updateSearchParams({
                nextQuery: query.trim(),
                nextPageToken: nextPageToken,
                nextPage,
                nextRegion: region,
              })
            }}
          />
        </>
      )}
    </div>
  )
}
