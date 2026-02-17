import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'


export default function Layout({children}) {
  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="layout-content">{children}</main>
      </div>
    </>
  )
}
