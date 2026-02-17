const API_BASE_URL = 'https://www.googleapis.com/youtube/v3'
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

if (!API_KEY) {
  // Surface a clear error early if the API key is missing.
  // eslint-disable-next-line no-console
  console.error('Missing VITE_YOUTUBE_API_KEY in .env')
}

export async function searchVideos(query, options = {}) {
  const params = new URLSearchParams({
    key: API_KEY || '',
    part: 'snippet',
    type: 'video',
    maxResults: '12',
    q: query,
    ...options,
  })

  const response = await fetch(`${API_BASE_URL}/search?${params}`)
  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`YouTube search failed: ${response.status} ${errorBody}`)
  }

  return response.json()
}

export async function getVideoDetails(videoId) {
  const params = new URLSearchParams({
    key: API_KEY || '',
    part: 'snippet,statistics,contentDetails',
    id: videoId,
  })

  const response = await fetch(`${API_BASE_URL}/videos?${params}`)
  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`YouTube details failed: ${response.status} ${errorBody}`)
  }

  return response.json()
}

export async function getPopularVideos(options = {}) {
  const params = new URLSearchParams({
    key: API_KEY || '',
    part: 'snippet',
    chart: 'mostPopular',
    maxResults: '12',
    ...options,
  })

  const response = await fetch(`${API_BASE_URL}/videos?${params}`)
  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`YouTube popular failed: ${response.status} ${errorBody}`)
  }

  return response.json()
}
