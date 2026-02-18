const API_BASE_URL = 'https://www.googleapis.com/youtube/v3'
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const shouldUseDummy = !API_KEY

const DUMMY_VIDEOS = [
  {
    id: { videoId: 'ms01a2b3c4d' },
    snippet: {
      title: 'Midnight City Walkthrough',
      channelTitle: 'Neon Signals',
      channelId: 'channel-neon',
      description: 'A calm walk through a neon city skyline and glowing alleys.',
      thumbnails: {
        medium: { url: 'https://picsum.photos/seed/mediastream-1/640/360' },
      },
    },
  },
  {
    id: { videoId: 'ms02e5f6g7h' },
    snippet: {
      title: 'Lo-fi Coding Session',
      channelTitle: 'Studio Pulse',
      channelId: 'channel-studio',
      description: 'Deep focus beats and ambient visuals for productive nights.',
      thumbnails: {
        medium: { url: 'https://picsum.photos/seed/mediastream-2/640/360' },
      },
    },
  },
  {
    id: { videoId: 'ms03i8j9k0l' },
    snippet: {
      title: 'Skyline Drone Tour',
      channelTitle: 'Aerial Atlas',
      channelId: 'channel-aerial',
      description: 'Smooth aerial shots over a futuristic skyline at sunrise.',
      thumbnails: {
        medium: { url: 'https://picsum.photos/seed/mediastream-3/640/360' },
      },
    },
  },
  {
    id: { videoId: 'ms04m1n2p3q' },
    snippet: {
      title: 'Rainy Night Drive',
      channelTitle: 'Night Route',
      channelId: 'channel-night',
      description: 'Cinematic rain-soaked drive with mellow synth tones.',
      thumbnails: {
        medium: { url: 'https://picsum.photos/seed/mediastream-4/640/360' },
      },
    },
  },
  {
    id: { videoId: 'ms05r4s5t6u' },
    snippet: {
      title: 'Minimal Desk Setup',
      channelTitle: 'Orbit Work',
      channelId: 'channel-orbit',
      description: 'A tour of a minimalist workspace with warm lighting.',
      thumbnails: {
        medium: { url: 'https://picsum.photos/seed/mediastream-5/640/360' },
      },
    },
  },
  {
    id: { videoId: 'ms06v7w8x9y' },
    snippet: {
      title: 'City Lights Timelapse',
      channelTitle: 'Frame Shift',
      channelId: 'channel-frame',
      description: 'Fast-paced timelapse of city lights and traffic flow.',
      thumbnails: {
        medium: { url: 'https://picsum.photos/seed/mediastream-6/640/360' },
      },
    },
  },
]

const DUMMY_DETAILS = DUMMY_VIDEOS.map((video, index) => ({
  id: video.id.videoId,
  snippet: video.snippet,
  statistics: {
    viewCount: String(240000 + index * 17321),
    likeCount: String(12000 + index * 734),
  },
  contentDetails: {
    duration: 'PT6M12S',
  },
}))

const getDummyList = (query) => {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return DUMMY_VIDEOS
  }

  const filtered = DUMMY_VIDEOS.filter((video) => {
    const title = video.snippet?.title?.toLowerCase() || ''
    const channel = video.snippet?.channelTitle?.toLowerCase() || ''
    return title.includes(normalized) || channel.includes(normalized)
  })

  return filtered.length > 0 ? filtered : DUMMY_VIDEOS
}

const getDummyDetails = (videoId) => {
  return DUMMY_DETAILS.find((video) => video.id === videoId) || DUMMY_DETAILS[0]
}

if (!API_KEY) {
  // Surface a clear error early if the API key is missing.
  // eslint-disable-next-line no-console
  console.warn('Missing VITE_YOUTUBE_API_KEY in .env, using dummy data instead.')
}

export async function searchVideos(query, options = {}) {
  if (shouldUseDummy) {
    return { items: getDummyList(query) }
  }

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

export async function getChannelUploads(channelId, options = {}) {
  if (shouldUseDummy) {
    const items = DUMMY_VIDEOS.filter((video) => video.snippet?.channelId === channelId)
    return { items: items.length > 0 ? items : DUMMY_VIDEOS }
  }

  const params = new URLSearchParams({
    key: API_KEY || '',
    part: 'snippet',
    type: 'video',
    channelId,
    order: 'date',
    maxResults: '12',
    ...options,
  })

  const response = await fetch(`${API_BASE_URL}/search?${params}`)
  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`YouTube channel uploads failed: ${response.status} ${errorBody}`)
  }

  return response.json()
}

export async function getVideoDetails(videoId) {
  if (shouldUseDummy) {
    return { items: [getDummyDetails(videoId)] }
  }

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
  if (shouldUseDummy) {
    return { items: DUMMY_VIDEOS }
  }

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

export async function getRelatedVideos(videoId, options = {}) {
  if (shouldUseDummy) {
    return { items: DUMMY_VIDEOS.filter((video) => video.id.videoId !== videoId) }
  }

  const params = new URLSearchParams({
    key: API_KEY || '',
    part: 'snippet',
    type: 'video',
    relatedToVideoId: videoId,
    maxResults: '12',
    ...options,
  })

  const response = await fetch(`${API_BASE_URL}/search?${params}`)
  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`YouTube related failed: ${response.status} ${errorBody}`)
  }

  return response.json()
}
