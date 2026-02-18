import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadHistory } from '../utils/watchHistory'

export default function WatchHistory() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const items = loadHistory()
      .slice()
      .sort((a, b) => (b.watchedAt || 0) - (a.watchedAt || 0))
    setHistory(items)
  }, [])

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Watch History</h1>
        <p>Revisit the videos you have recently watched.</p>
      </header>

      {history.length === 0 && <p>No watch history yet. Play a video to get started.</p>}

      {history.length > 0 && (
        <section className="video-grid">
          {history.map((entry) => {
            const snippet = entry.snippet || {}
            const thumbnail = snippet.thumbnails?.medium?.url
            return (
              <Link className="video-card" to={`/watch/${entry.id}`} key={entry.id}>
                {thumbnail && (
                  <img
                    src={thumbnail}
                    alt={snippet.title}
                    loading="lazy"
                  />
                )}
                <div>
                  <h3>{snippet.title || 'Untitled video'}</h3>
                  <p>{snippet.channelTitle || 'Unknown channel'}</p>
                  {entry.watchedAt && (
                    <p>{new Date(entry.watchedAt).toLocaleString()}</p>
                  )}
                </div>
              </Link>
            )
          })}
        </section>
      )}
    </div>
  )
}
