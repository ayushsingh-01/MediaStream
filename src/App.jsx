import './App.css'
import Layout from './components/Layout'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Watch from './pages/Watch'
import WatchHistory from './pages/WatchHistory'
import Upload from './pages/Upload'
import Profile from './pages/Profile'

function App() {

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/featured" element={<WatchHistory />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App
