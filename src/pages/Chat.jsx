import { useState, useEffect, useMemo } from 'react'
import { mockFriends, mockChats, mockChatPreviews } from '../data/mockData'
import ChatSidebar from '../components/ChatSidebar'
import ChatWindow from '../components/ChatWindow'

export default function Chat({ initialFriendId = null }) {
  const [activeId, setActiveId] = useState(initialFriendId)
  const [chats, setChats] = useState(mockChats)
  const [previews, setPreviews] = useState(mockChatPreviews)

  /* Sync with external trigger (opening chat from Friends page) */
  useEffect(() => {
    if (initialFriendId) setActiveId(initialFriendId)
  }, [initialFriendId])

  /* Build friends-by-id map once */
  const friendsById = useMemo(() => {
    const m = {}
    for (const f of mockFriends) m[f.id] = f
    return m
  }, [])

  /* Sidebar conversations (enrich previews with friend objects) */
  const conversations = useMemo(
    () => previews
      .map(p => ({ ...p, friend: friendsById[p.friendId] }))
      .filter(c => c.friend),
    [previews, friendsById]
  )

  const activeFriend = activeId ? friendsById[activeId] : null
  const activeMessages = activeId ? (chats[activeId] || []) : []

  /* Select a chat → clear unread counter */
  const handleSelect = (id) => {
    setActiveId(id)
    setPreviews(prev => prev.map(p => p.friendId === id ? { ...p, unread: 0 } : p))
  }

  /* Send message (local only) */
  const handleSend = (text) => {
    const time = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: false,
    })
    setChats(prev => ({
      ...prev,
      [activeId]: [
        ...(prev[activeId] || []),
        { id: Date.now(), text, time, isOwn: true },
      ],
    }))
    setPreviews(prev => {
      const exists = prev.find(p => p.friendId === activeId)
      const updated = { friendId: activeId, lastMessage: text, time, unread: 0 }
      if (exists) {
        return [updated, ...prev.filter(p => p.friendId !== activeId)]
      }
      return [updated, ...prev]
    })
  }

  return (
    <div className="ch-page bg-noir-black">
      <div className="ch-shell">
        {/* Mobile: sidebar OR window. Desktop: both. */}
        <div className={`ch-sidebar-wrap ${activeId ? 'ch-hide-mobile' : ''}`}>
          <ChatSidebar
            conversations={conversations}
            activeId={activeId}
            onSelect={handleSelect}
          />
        </div>

        <div className={`ch-window-wrap ${!activeId ? 'ch-hide-mobile' : ''}`}>
          <ChatWindow
            friend={activeFriend}
            messages={activeMessages}
            onSend={handleSend}
            onBack={() => setActiveId(null)}
          />
        </div>
      </div>
    </div>
  )
}
