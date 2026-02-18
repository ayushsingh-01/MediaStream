import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getChannelUploads, getVideoDetails } from '../api/youtube'
import { upsertHistory } from '../utils/watchHistory'

export default function Watch() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [recommended, setRecommended] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const isValidVideoId = (value) => /^[a-zA-Z0-9_-]{11}$/.test(value || '')

  useEffect(() => {
    let isActive = true

    const loadVideo = async () => {
      if (!isValidVideoId(id)) {
        setVideo(null)
        setRecommended([])
        setStatus('idle')
        setError('Select a video to watch.')
        return
      }

      setStatus('loading')
      setError('')

      try {
        const data = await getVideoDetails(id)
        if (!isActive) return
        const currentVideo = data?.items?.[0] || null
        setVideo(currentVideo)
        upsertHistory(currentVideo)

        const channelId = currentVideo?.snippet?.channelId

        const applyRecommendations = (items, excludeId) => {
          setRecommended((items || []).filter((item) => item.id?.videoId && item.id.videoId !== excludeId))
        }

        if (channelId) {
          try {
            const recData = await getChannelUploads(channelId, { maxResults: '12' })
            if (!isActive) return
            applyRecommendations(recData.items, id)
          } catch {
            if (!isActive) return
            setRecommended([])
          }
        } else {
          setRecommended([])
        }
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
      {status === 'loading' && (
        <div className="watch-layout shimmer-layout" aria-label="Loading video">
          <div className="watch-player">
            <div className="shimmer-player shimmer-animate" />
            <div className="watch-details shimmer-card">
              <div className="shimmer-line shimmer-animate" />
              <div className="shimmer-line shimmer-animate short" />
              <div className="shimmer-line shimmer-animate" />
            </div>
          </div>
          <aside className="watch-recommended">
            <h3>More videos</h3>
            <div className="recommended-list">
              {Array.from({ length: 5 }).map((_, index) => (
                <div className="recommended-card shimmer-card" key={`rec-shimmer-${index}`}>
                  <div className="shimmer-thumb shimmer-animate" />
                  <div>
                    <div className="shimmer-line shimmer-animate" />
                    <div className="shimmer-line shimmer-animate short" />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
      {status === 'error' && <p>{error}</p>}
      {status === 'idle' && error && <p>{error}</p>}

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

          <aside className="watch-recommended">
            <h3>More videos</h3>
            <div className="recommended-list">
              {recommended.map((item) => {
                const snippet = item.snippet || {}
                const thumbnail = snippet.thumbnails?.medium?.url
                const videoId = item.id?.videoId
                return (
                  <Link
                    className="recommended-card"
                    to={`/watch/${videoId}`}
                    key={videoId}
                  >
                    {thumbnail && (
                      <img
                        src={thumbnail}
                        alt={snippet.title}
                        loading="lazy"
                      />
                    )}
                    <div>
                      <p>{snippet.title}</p>
                      <span>{snippet.channelTitle}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
