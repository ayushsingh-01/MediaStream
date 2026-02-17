import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPopularVideos, searchVideos } from '../api/youtube'

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
  const [query, setQuery] = useState(DEFAULT_QUERY)
  const [draftQuery, setDraftQuery] = useState(DEFAULT_QUERY)
  const [videos, setVideos] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    const loadVideos = async () => {
      setStatus('loading')
      setError('')

      try {
        const trimmedQuery = query.trim()
        const data = trimmedQuery.length > 0
          ? await searchVideos(trimmedQuery)
          : await getPopularVideos({
              regionCode: POPULAR_REGIONS[Math.floor(Math.random() * POPULAR_REGIONS.length)],
            })
        if (!isActive) return
        setVideos(shuffleVideos(data.items || []))
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
  }, [query])

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>MediaStream</h1>
        <p>Explore YouTube videos directly in MediaStream.</p>
        <form
          className="home-search"
          onSubmit={(event) => {
            event.preventDefault()
            setQuery(draftQuery)
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
      </header>

      {status === 'loading' && <p>Loading videos...</p>}
      {status === 'error' && <p>{error}</p>}

      {status === 'ready' && (
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
      )}
    </div>
  )
}
