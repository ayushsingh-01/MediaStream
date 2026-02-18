import { useState } from 'react'

export default function SuggestionBox({ suggestions = [], isOpen = false, onSelect }) {
  const [activeIndex, setActiveIndex] = useState(-1)

  if (!isOpen || suggestions.length === 0) {
    return null
  }

  return (
    <div className="suggestion-box" role="listbox" aria-label="Search suggestions">
      {suggestions.map((item, index) => (
        <button
          key={item}
          type="button"
          className={`suggestion-item${index === activeIndex ? ' is-active' : ''}`}
          onMouseEnter={() => setActiveIndex(index)}
          onMouseDown={(event) => {
            event.preventDefault()
            onSelect?.(item)
          }}
        >
          {item}
        </button>
      ))}
    </div>
  )
}
