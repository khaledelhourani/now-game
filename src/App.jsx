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
import Friends from './pages/Friends'
import Chat from './pages/Chat'
import { mockProfile } from './data/mockData'

const PAGES_WITH_NAVBAR = ['lobby', 'profile', 'editProfile', 'settings', 'friends', 'chat']

function AppContent() {
  const [page, setPage] = useState('landing')
  const [profile, setProfile] = useState(mockProfile)
  const [chatTarget, setChatTarget] = useState(null)

  const showNavbar = PAGES_WITH_NAVBAR.includes(page)

  const openChatWith = (friendId) => setChatTarget(friendId)

  const renderPage = () => {
    switch (page) {
      case 'landing':     return <Landing setPage={setPage} />
      case 'auth':        return <Auth setPage={setPage} />
      case 'lobby':       return <Lobby setPage={setPage} />
      case 'game':        return <GameRoom setPage={setPage} />
      case 'profile':     return <Profile setPage={setPage} profile={profile} />
      case 'editProfile': return <EditProfile setPage={setPage} profile={profile} onSave={updates => setProfile(p => ({ ...p, ...updates }))} />
      case 'settings':    return <Settings setPage={setPage} />
      case 'friends':     return <Friends setPage={setPage} onOpenChat={openChatWith} />
      case 'chat':        return <Chat initialFriendId={chatTarget} />
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
