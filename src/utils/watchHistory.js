const STORAGE_KEY = 'mediastream.watchHistory'

export const loadHistory = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    return []
  }
}

export const saveHistory = (items) => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    // Ignore storage write failures.
  }
}

export const upsertHistory = (video) => {
  if (!video) {
    return []
  }

  const videoId = video.id?.videoId || video.id
  if (!videoId) {
    return []
  }

  const entry = {
    id: videoId,
    snippet: video.snippet || {},
    watchedAt: Date.now(),
  }

  const items = loadHistory().filter((item) => item.id && item.id !== videoId)
  items.unshift(entry)
  const trimmed = items.slice(0, 50)
  saveHistory(trimmed)
  return trimmed
}
