import { useState } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Lobby from './pages/Lobby'
import GameRoom from './pages/GameRoom'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Settings from './pages/Settings'
import { mockProfile } from './data/mockData'

const PAGES_WITH_NAVBAR = ['lobby', 'game', 'profile', 'editProfile', 'settings']

function AppContent() {
  const [page, setPage] = useState('landing')
  const [profile, setProfile] = useState(mockProfile)

  const showNavbar = PAGES_WITH_NAVBAR.includes(page)

  const renderPage = () => {
    switch (page) {
      case 'landing':     return <Landing setPage={setPage} />
      case 'auth':        return <Auth setPage={setPage} />
      case 'lobby':       return <Lobby setPage={setPage} />
      case 'game':        return <GameRoom setPage={setPage} />
      case 'profile':     return <Profile setPage={setPage} profile={profile} />
      case 'editProfile': return <EditProfile setPage={setPage} profile={profile} onSave={updates => setProfile(p => ({ ...p, ...updates }))} />
      case 'settings':    return <Settings setPage={setPage} />
      default:            return <Landing setPage={setPage} />
    }
  }

  return (
    <>
      {showNavbar && <Navbar currentPage={page} setPage={setPage} />}
      <main>{renderPage()}</main>
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  )
}
