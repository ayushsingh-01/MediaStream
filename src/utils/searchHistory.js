const STORAGE_KEY = 'mediastream.searchHistory'

export const loadSearchHistory = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const saveSearchHistory = (items) => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Ignore storage write failures.
  }
}

export const addSearchHistory = (value) => {
  const trimmed = value.trim()
  if (!trimmed) {
    return loadSearchHistory()
  }

  const items = loadSearchHistory().filter((item) => item.toLowerCase() !== trimmed.toLowerCase())
  items.unshift(trimmed)
  const trimmedItems = items.slice(0, 8)
  saveSearchHistory(trimmedItems)
  return trimmedItems
}
