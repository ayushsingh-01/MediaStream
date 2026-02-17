import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getVideoDetails } from '../api/youtube'

export default function Watch() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    const loadVideo = async () => {
      setStatus('loading')
      setError('')

      try {
        const data = await getVideoDetails(id)
        if (!isActive) return
        setVideo(data.items?.[0] || null)
        setStatus('ready')
      } catch (err) {
        if (!isActive) return
        setStatus('error')
        setError(err?.message || 'Unable to load video')
      }
    }

    if (id) {
      loadVideo()
    }

    return () => {
      isActive = false
    }
  }, [id])

  const snippet = video?.snippet
  const stats = video?.statistics

  return (
    <div className="watch-page">
      {status === 'loading' && <p>Loading video...</p>}
      {status === 'error' && <p>{error}</p>}

      {status === 'ready' && video && (
        <div className="watch-layout">
          <div className="watch-player">
            <iframe
              title={snippet?.title || 'YouTube player'}
              width="100%"
              height="420"
              src={`https://www.youtube.com/embed/${id}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="watch-details">
              <h2>{snippet?.title}</h2>
              <p>{snippet?.channelTitle}</p>
              {stats && (
                <p>
                  {Number(stats.viewCount || 0).toLocaleString()} views ·{' '}
                  {Number(stats.likeCount || 0).toLocaleString()} likes
                </p>
              )}
              {snippet?.description ? (
                <p className="watch-description">{snippet.description}</p>
              ) : (
                <p className="watch-description">No description provided.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
