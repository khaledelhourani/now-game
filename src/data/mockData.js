export const mockRooms = [
  {
    id: 1,
    name: 'Chicago Nights',
    host: 'Don Vito',
    players: 7,
    maxPlayers: 12,
    status: 'waiting',
    isPrivate: false,
    language: 'en',
    mode: 'Classic',
    createdAt: '2 min ago',
  },
  {
    id: 2,
    name: 'الليلة الأخيرة',
    host: 'السلطان',
    players: 10,
    maxPlayers: 10,
    status: 'playing',
    isPrivate: false,
    language: 'ar',
    mode: 'Advanced',
    createdAt: '8 min ago',
  },
  {
    id: 3,
    name: 'Sicilian Blood',
    host: 'Scarface',
    players: 4,
    maxPlayers: 8,
    status: 'waiting',
    isPrivate: true,
    language: 'en',
    mode: 'Classic',
    createdAt: '1 min ago',
  },
  {
    id: 4,
    name: 'عالم الظلام',
    host: 'الشبح',
    players: 6,
    maxPlayers: 10,
    status: 'waiting',
    isPrivate: false,
    language: 'ar',
    mode: 'Classic',
    createdAt: '5 min ago',
  },
  {
    id: 5,
    name: 'The Godfather',
    host: 'Michael C.',
    players: 12,
    maxPlayers: 12,
    status: 'playing',
    isPrivate: false,
    language: 'en',
    mode: 'Advanced',
    createdAt: '15 min ago',
  },
  {
    id: 6,
    name: 'Dark Alley',
    host: 'Tommy G.',
    players: 3,
    maxPlayers: 8,
    status: 'waiting',
    isPrivate: false,
    language: 'en',
    mode: 'Classic',
    createdAt: '30 sec ago',
  },
  {
    id: 7,
    name: 'ليالي المافيا',
    host: 'نادر_X',
    players: 8,
    maxPlayers: 12,
    status: 'waiting',
    isPrivate: true,
    language: 'ar',
    mode: 'Advanced',
    createdAt: '3 min ago',
  },
]

export const mockPlayers = [
  { id: 1,  name: 'Don Vito',   avatar: '🎩', role: 'mafia',     status: 'alive',  votes: 2, isSelf: true  },
  { id: 2,  name: 'Scarface',   avatar: '😈', role: 'citizen',   status: 'alive',  votes: 0, isSelf: false },
  { id: 3,  name: 'Tommy G.',   avatar: '🔫', role: 'detective', status: 'alive',  votes: 1, isSelf: false },
  { id: 4,  name: 'Rosa M.',    avatar: '🌹', role: 'doctor',    status: 'alive',  votes: 0, isSelf: false },
  { id: 5,  name: 'Carlo B.',   avatar: '🃏', role: 'citizen',   status: 'dead',   votes: 3, isSelf: false },
  { id: 6,  name: 'Luca B.',    avatar: '🎭', role: 'mafia',     status: 'alive',  votes: 1, isSelf: false },
  { id: 7,  name: 'Connie C.',  avatar: '💎', role: 'citizen',   status: 'alive',  votes: 0, isSelf: false },
  { id: 8,  name: 'Fredo C.',   avatar: '🥃', role: 'citizen',   status: 'alive',  votes: 0, isSelf: false },
  { id: 9,  name: 'Salvatore',  avatar: '🗡️', role: 'mafia',     status: 'alive',  votes: 0, isSelf: false },
  { id: 10, name: 'Vincenzo',   avatar: '🎯', role: 'citizen',   status: 'alive',  votes: 0, isSelf: false },
  { id: 11, name: 'Alessia',    avatar: '🦋', role: 'doctor',    status: 'alive',  votes: 0, isSelf: false },
  { id: 12, name: 'Marco P.',   avatar: '🐺', role: 'citizen',   status: 'alive',  votes: 0, isSelf: false },
  { id: 13, name: 'Giovanni',   avatar: '🦅', role: 'detective', status: 'alive',  votes: 0, isSelf: false },
  { id: 14, name: 'Lucia R.',   avatar: '🔮', role: 'citizen',   status: 'alive',  votes: 0, isSelf: false },
  { id: 15, name: 'Dante',      avatar: '🐍', role: 'mafia',     status: 'dead',   votes: 4, isSelf: false },
  { id: 16, name: 'Sofia V.',   avatar: '👑', role: 'citizen',   status: 'alive',  votes: 0, isSelf: false },
  { id: 17, name: 'Nico T.',    avatar: '🎲', role: 'citizen',   status: 'alive',  votes: 0, isSelf: false },
  { id: 18, name: 'Valentina',  avatar: '🌙', role: 'citizen',   status: 'alive',  votes: 0, isSelf: false },
  { id: 19, name: 'Roberto',    avatar: '⚡', role: 'mafia',     status: 'alive',  votes: 0, isSelf: false },
  { id: 20, name: 'Isabella',   avatar: '🎪', role: 'citizen',   status: 'alive',  votes: 0, isSelf: false },
]

export const mockMessages = [
  { id: 1,  sender: 'Tommy G.',  text: 'I saw Don Vito near the docks last night…',         time: '22:01', isOwn: false },
  { id: 2,  sender: 'Rosa M.',   text: "That's suspicious. We should vote him out.",          time: '22:02', isOwn: false },
  { id: 3,  sender: 'You',       text: 'I was nowhere near the docks. False accusation!',    time: '22:02', isOwn: true  },
  { id: 4,  sender: 'Scarface',  text: 'The doctor saved someone last night. Who?',          time: '22:03', isOwn: false },
  { id: 5,  sender: 'Luca B.',   text: 'Focus — we need to eliminate the detective first.',  time: '22:03', isOwn: false },
  { id: 6,  sender: 'Connie C.', text: 'I trust Don Vito. He seems honest.',                time: '22:04', isOwn: false },
  { id: 7,  sender: 'You',       text: 'Thank you Connie. I say we look at Luca.',           time: '22:04', isOwn: true  },
  { id: 8,  sender: 'Fredo C.',  text: 'Luca was acting strange during the vote…',          time: '22:05', isOwn: false },
]

export const mockGameHistory = [
  { id: 1, room: 'Chicago Nights',   role: 'mafia',     result: 'win',  date: '2024-03-15', players: 10 },
  { id: 2, room: 'Sicilian Blood',   role: 'citizen',   result: 'loss', date: '2024-03-14', players: 8  },
  { id: 3, room: 'The Godfather',    role: 'detective', result: 'win',  date: '2024-03-13', players: 12 },
  { id: 4, room: 'Dark Alley',       role: 'doctor',    result: 'win',  date: '2024-03-12', players: 8  },
  { id: 5, room: 'الليلة الأخيرة',   role: 'citizen',   result: 'loss', date: '2024-03-10', players: 10 },
]

export const mockAchievements = [
  { id: 1,  key: 'firstBlood',   icon: '🩸', unlocked: true,  progress: 100, max: 1  },
  { id: 2,  key: 'assassin',     icon: '🔪', unlocked: true,  progress: 10,  max: 10 },
  { id: 3,  key: 'shadowMaster', icon: '🌑', unlocked: true,  progress: 5,   max: 5  },
  { id: 4,  key: 'survivorI',    icon: '🛡️', unlocked: true,  progress: 1,   max: 1  },
  { id: 5,  key: 'deceptionArt', icon: '🎭', unlocked: false, progress: 7,   max: 20 },
  { id: 6,  key: 'untouchable',  icon: '💎', unlocked: false, progress: 3,   max: 10 },
]

export const mockProfile = {
  id: 1,
  username: 'Don Vito',
  displayName: 'Don Vito',
  email: 'don.vito@famiglia.com',
  avatar: '🎩',
  avatarImage: null,
  level: 17,
  xp: 3420,
  xpNext: 4000,
  wins: 48,
  losses: 22,
  played: 70,
  winRate: 68.6,
  rank: 'Capo',
  totalKills: 31,
  survivedNights: 142,
  favoriteRole: 'mafia',
  bio: 'The Don never sleeps. Fear is my weapon.',
  memberSince: 'January 2024',
}

export const mockStats = {
  playersOnline: 2847,
  gamesPlayed: 1423,
  roomsOpen: 38,
}

/* ─────────── Friends ─────────── */
export const mockFriends = [
  { id: 101, username: 'Scarface',   avatar: '😈', online: true,  level: 22, rank: 'Boss',        lastSeen: 'now' },
  { id: 102, username: 'Tommy G.',   avatar: '🔫', online: true,  level: 15, rank: 'Soldier',     lastSeen: 'now' },
  { id: 103, username: 'Rosa M.',    avatar: '🌹', online: false, level: 18, rank: 'Capo',        lastSeen: '2h ago' },
  { id: 104, username: 'Luca B.',    avatar: '🎭', online: true,  level: 12, rank: 'Associate',   lastSeen: 'now' },
  { id: 105, username: 'Connie C.',  avatar: '💎', online: false, level: 9,  rank: 'Rookie',      lastSeen: '1d ago' },
  { id: 106, username: 'Salvatore',  avatar: '🗡️', online: true,  level: 27, rank: 'Godfather',   lastSeen: 'now' },
  { id: 107, username: 'Fredo C.',   avatar: '🥃', online: false, level: 11, rank: 'Associate',   lastSeen: '30m ago' },
  { id: 108, username: 'Alessia',    avatar: '🦋', online: true,  level: 14, rank: 'Soldier',     lastSeen: 'now' },
]

export const mockFriendRequests = [
  { id: 201, username: 'Marco P.',   avatar: '🐺', level: 8,  mutuals: 3, sentAt: '5m ago' },
  { id: 202, username: 'Giovanni',   avatar: '🦅', level: 19, mutuals: 6, sentAt: '1h ago' },
  { id: 203, username: 'Lucia R.',   avatar: '🔮', level: 13, mutuals: 2, sentAt: '3h ago' },
  { id: 204, username: 'Sofia V.',   avatar: '👑', level: 24, mutuals: 8, sentAt: 'yesterday' },
]

export const mockDiscoverPlayers = [
  { id: 301, username: 'Vincenzo',   avatar: '🎯', level: 16, rank: 'Capo',     relation: 'none' },
  { id: 302, username: 'Nico T.',    avatar: '🎲', level: 10, rank: 'Associate',relation: 'sent' },
  { id: 303, username: 'Isabella',   avatar: '🎪', level: 21, rank: 'Boss',     relation: 'friends' },
  { id: 304, username: 'Roberto',    avatar: '⚡', level: 7,  rank: 'Rookie',   relation: 'none' },
  { id: 305, username: 'Valentina',  avatar: '🌙', level: 17, rank: 'Capo',     relation: 'none' },
  { id: 306, username: 'Dante',      avatar: '🐍', level: 25, rank: 'Boss',     relation: 'sent' },
]

/* ─────────── Chat (private DMs) ─────────── */
export const mockChats = {
  101: [
    { id: 1, text: 'Hey Don! Ready for tonight?',               time: '21:45', isOwn: false },
    { id: 2, text: 'Always. The family comes first.',           time: '21:46', isOwn: true  },
    { id: 3, text: 'I heard Tommy was asking about you…',       time: '21:48', isOwn: false },
    { id: 4, text: 'Let him ask. I have nothing to hide.',      time: '21:49', isOwn: true  },
    { id: 5, text: 'See you at the docks.',                     time: '21:50', isOwn: false },
  ],
  102: [
    { id: 1, text: 'Did you see the last round? Brutal.',       time: '18:10', isOwn: false },
    { id: 2, text: 'The detective was too fast.',               time: '18:12', isOwn: true  },
    { id: 3, text: 'We need better coordination next time.',    time: '18:13', isOwn: false },
  ],
  103: [
    { id: 1, text: 'Good game earlier 💪',                      time: '14:02', isOwn: true  },
    { id: 2, text: 'Thanks! Your vote saved me 😄',             time: '14:05', isOwn: false },
  ],
  104: [
    { id: 1, text: 'Want to play a private match?',             time: '12:30', isOwn: false },
    { id: 2, text: 'Sure, create a room.',                      time: '12:31', isOwn: true  },
    { id: 3, text: 'Done. Check your invites.',                 time: '12:33', isOwn: false },
  ],
  105: [
    { id: 1, text: 'GG last night!',                            time: 'Mon',   isOwn: false },
  ],
  106: [
    { id: 1, text: 'Boss, we need to talk.',                    time: '09:11', isOwn: false },
    { id: 2, text: 'Later. I am busy.',                         time: '09:15', isOwn: true  },
  ],
  107: [
    { id: 1, text: 'Did you join the new lobby yet?',           time: 'Sun',   isOwn: false },
  ],
  108: [
    { id: 1, text: '🌸 Good morning!',                          time: '08:02', isOwn: false },
    { id: 2, text: 'Morning 🎩',                                time: '08:05', isOwn: true  },
    { id: 3, text: 'Playing tonight?',                          time: '08:06', isOwn: false },
    { id: 4, text: 'Of course. 20:00 sharp.',                   time: '08:07', isOwn: true  },
  ],
}

export const mockChatPreviews = [
  { friendId: 101, lastMessage: 'See you at the docks.',        time: '21:50', unread: 2 },
  { friendId: 108, lastMessage: 'Of course. 20:00 sharp.',      time: '08:07', unread: 0 },
  { friendId: 104, lastMessage: 'Done. Check your invites.',    time: '12:33', unread: 1 },
  { friendId: 102, lastMessage: 'We need better coordination…', time: '18:13', unread: 0 },
  { friendId: 106, lastMessage: 'Boss, we need to talk.',       time: '09:11', unread: 3 },
  { friendId: 103, lastMessage: 'Your vote saved me 😄',        time: '14:05', unread: 0 },
  { friendId: 105, lastMessage: 'GG last night!',               time: 'Mon',   unread: 0 },
  { friendId: 107, lastMessage: 'Did you join the new lobby?',  time: 'Sun',   unread: 0 },
]
