import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  {
    to: '/',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.2 3 10v10h6.2v-6.2h5.6V20H21V10l-9-6.8Z" />
      </svg>
    ),
  },
  {
    to: '/watch/featured',
    label: 'Watch History',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 7.5c0-1.4 1.1-2.5 2.5-2.5h13c1.4 0 2.5 1.1 2.5 2.5v9c0 1.4-1.1 2.5-2.5 2.5h-13C4.1 19 3 17.9 3 16.5v-9Zm8.4 2.2v4.6l4.1-2.3-4.1-2.3Z" />
      </svg>
    ),
  },
  {
    to: '/upload',
    label: 'Upload',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4.5 7.5 9h3.2v6h2.6V9h3.2L12 4.5ZM6 18.2h12V20H6v-1.8Z" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12.5a4 4 0 1 0-0.1-8 4 4 0 0 0 0.1 8Zm0 2.2c-4 0-7.2 2-7.2 4.5V21h14.4v-1.8c0-2.5-3.2-4.5-7.2-4.5Z" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <nav className="sidebar" aria-label="Primary">
      <ul>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <li key={item.to}>
              <Link
                className={`sidebar-link${isActive ? ' is-active' : ''}`}
                to={item.to}
                title={item.label}
                aria-label={item.label}
              >
                {item.icon}
                <span className="sr-only">{item.label}</span>
              </Link>
            </li>
          )}
        )}
      </ul>
    </nav>
  )
}
