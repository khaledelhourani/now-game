/**
 * MafiaGame — Core game engine for the Mafia social deduction game.
 * Pure JavaScript state machine. Framework-agnostic.
 * Create one instance per room for multi-room support.
 */

export const PHASES = {
  WAITING:        'waiting',
  ROLE_REVEAL:    'roleReveal',
  NIGHT:          'night',
  DAY_RESULTS:    'dayResults',
  DAY_DISCUSSION: 'dayDiscussion',
  DAY_VOTING:     'dayVoting',
  GAME_OVER:      'gameOver',
}

export const ROLES = {
  MAFIA:     'mafia',
  DETECTIVE: 'detective',
  DOCTOR:    'doctor',
  CITIZEN:   'citizen',
}

export const PHASE_TIMERS = {
  [PHASES.ROLE_REVEAL]:    30,
  [PHASES.NIGHT]:          30,
  [PHASES.DAY_RESULTS]:    6,
  [PHASES.DAY_DISCUSSION]: 50,
  [PHASES.DAY_VOTING]:     30,
}

/* ── helpers ── */
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function now() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

/* ═══════════════════════════════════════ */

export default class MafiaGame {
  constructor(playerData, selfId) {
    this.selfId = selfId
    this.players = playerData.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      isSelf: p.id === selfId,
      role: null,
      status: 'alive',
      votes: 0,
    }))
    this.phase = PHASES.WAITING
    this.round = 0
    this.winner = null

    // Night
    this.nightActions = { mafiaTarget: null, detectiveTarget: null, doctorTarget: null }
    this.lastDoctorTarget = null   // can't heal same player twice in a row
    this.lastNightResult = null
    this.investigationResult = null // detective feedback

    // Day
    this.votesCast = {}            // voterId → targetId
    this.lastVoteResult = null

    // Event log
    this.events = []
  }

  /* ── Role distribution ── */
  assignRoles() {
    const n = this.players.length
    const mafiaCount = n <= 6 ? 1 : n <= 9 ? 2 : n <= 14 ? 3 : 4
    const roles = []
    for (let i = 0; i < mafiaCount; i++) roles.push(ROLES.MAFIA)
    roles.push(ROLES.DETECTIVE)
    roles.push(ROLES.DOCTOR)
    while (roles.length < n) roles.push(ROLES.CITIZEN)
    const shuffled = shuffle(roles)
    this.players.forEach((p, i) => { p.role = shuffled[i] })
  }

  /* ── Phase transitions ── */

  startGame() {
    this.assignRoles()
    this.phase = PHASES.ROLE_REVEAL
    this._event('🎮', 'Roles have been assigned — check your card!')
    return this.getSelf()
  }

  startNight() {
    this.round++
    this.phase = PHASES.NIGHT
    this.nightActions = { mafiaTarget: null, detectiveTarget: null, doctorTarget: null }
    this.investigationResult = null
    this._event('🌙', `Night ${this.round} — the town sleeps`)
  }

  /** Player submits a night action. Returns investigation result for detective. */
  submitNightAction(playerId, targetId) {
    const player = this.players.find(p => p.id === playerId)
    if (!player || player.status !== 'alive') return null

    switch (player.role) {
      case ROLES.MAFIA:
        this.nightActions.mafiaTarget = targetId
        return null

      case ROLES.DETECTIVE: {
        this.nightActions.detectiveTarget = targetId
        const t = this.players.find(p => p.id === targetId)
        if (t) {
          this.investigationResult = {
            playerId: targetId,
            playerName: t.name,
            playerAvatar: t.avatar,
            isMafia: t.role === ROLES.MAFIA,
          }
        }
        return this.investigationResult
      }

      case ROLES.DOCTOR:
        this.nightActions.doctorTarget = targetId
        return null

      default:
        return null
    }
  }

  /** AI players act during night. Call before resolveNight. */
  runAINight() {
    const alive = this.players.filter(p => p.status === 'alive')
    const nonMafiaAlive = alive.filter(p => p.role !== ROLES.MAFIA)

    // AI Mafia — agree on a target (skip if self-player is mafia and already chose)
    if (!this.nightActions.mafiaTarget) {
      const targets = nonMafiaAlive.length > 0 ? nonMafiaAlive : alive
      this.nightActions.mafiaTarget = pickRandom(targets).id
    }

    // AI Detective
    const selfPlayer = this.getSelf()
    const aiDetective = alive.find(p => p.role === ROLES.DETECTIVE && !p.isSelf)
    if (aiDetective && !this.nightActions.detectiveTarget) {
      const targets = alive.filter(p => p.id !== aiDetective.id)
      if (targets.length) this.nightActions.detectiveTarget = pickRandom(targets).id
    }

    // AI Doctor
    const aiDoctor = alive.find(p => p.role === ROLES.DOCTOR && !p.isSelf)
    if (aiDoctor && !this.nightActions.doctorTarget) {
      let targets = alive
      if (this.lastDoctorTarget) {
        targets = alive.filter(p => p.id !== this.lastDoctorTarget)
        if (!targets.length) targets = alive // fallback
      }
      this.nightActions.doctorTarget = pickRandom(targets).id
    }
  }

  resolveNight() {
    this.runAINight()

    const result = { killed: null, saved: false, savedPlayer: null }
    const targetId = this.nightActions.mafiaTarget

    if (targetId) {
      if (this.nightActions.doctorTarget === targetId) {
        result.saved = true
        result.savedPlayer = this.players.find(p => p.id === targetId)
        this._event('💊', `The Doctor saved a life tonight!`)
      } else {
        const victim = this.players.find(p => p.id === targetId)
        if (victim && victim.status === 'alive') {
          victim.status = 'dead'
          result.killed = victim
          this._event('💀', `${victim.name} was eliminated by the Mafia`)
        }
      }
    } else {
      this._event('🌙', 'A quiet night — nobody was targeted')
    }

    this.lastDoctorTarget = this.nightActions.doctorTarget
    this.lastNightResult = result
    this.phase = PHASES.DAY_RESULTS
    return result
  }

  startDayDiscussion() {
    this.phase = PHASES.DAY_DISCUSSION
    this._resetVotes()
    this._event('☀️', `Day ${this.round} — discuss and find the Mafia`)
  }

  startVoting() {
    this.phase = PHASES.DAY_VOTING
    this._resetVotes()
    this._event('🗳️', 'Voting has begun — choose wisely')
  }

  castVote(voterId, targetId) {
    if (this.votesCast[voterId]) return false
    const voter = this.players.find(p => p.id === voterId)
    const target = this.players.find(p => p.id === targetId)
    if (!voter || !target) return false
    if (voter.status !== 'alive' || target.status !== 'alive') return false
    if (voterId === targetId) return false

    this.votesCast[voterId] = targetId
    target.votes++
    return true
  }

  /** AI players vote. Returns array of { voterId, targetId } for staggered UI. */
  getAIVotePlan() {
    const alive = this.players.filter(p => p.status === 'alive' && !p.isSelf)
    const validTargets = this.players.filter(p => p.status === 'alive')
    const plan = []

    alive.forEach(ai => {
      if (this.votesCast[ai.id]) return
      const targets = validTargets.filter(p => p.id !== ai.id)
      if (!targets.length) return
      plan.push({ voterId: ai.id, targetId: pickRandom(targets).id })
    })

    return shuffle(plan) // randomize order
  }

  resolveVotes() {
    const alive = this.players.filter(p => p.status === 'alive')
    let maxVotes = 0
    let eliminated = null
    let tieCount = 0

    alive.forEach(p => {
      if (p.votes > maxVotes) {
        maxVotes = p.votes
        eliminated = p
        tieCount = 1
      } else if (p.votes === maxVotes && p.votes > 0) {
        tieCount++
      }
    })

    if (tieCount > 1 || maxVotes === 0) {
      this._event('⚖️', 'Vote tied — nobody was eliminated')
      this.lastVoteResult = { eliminated: null, tie: true }
      return this.lastVoteResult
    }

    eliminated.status = 'dead'
    const roleLabel = eliminated.role === ROLES.MAFIA ? 'Mafia' : 'innocent'
    this._event('💀', `${eliminated.name} was voted out — they were ${roleLabel}`)
    this.lastVoteResult = { eliminated, tie: false }
    return this.lastVoteResult
  }

  /** Returns 'town' | 'mafia' | null */
  checkWinCondition() {
    const alive = this.players.filter(p => p.status === 'alive')
    const mafiaAlive = alive.filter(p => p.role === ROLES.MAFIA).length
    const townAlive = alive.length - mafiaAlive

    if (mafiaAlive === 0) {
      this.winner = 'town'
      this.phase = PHASES.GAME_OVER
      this._event('🏆', 'The Town wins! All Mafia eliminated!')
      return 'town'
    }
    if (mafiaAlive >= townAlive) {
      this.winner = 'mafia'
      this.phase = PHASES.GAME_OVER
      this._event('🏆', 'The Mafia wins! They control the town!')
      return 'mafia'
    }
    return null
  }

  /* ── Queries ── */

  getSelf()          { return this.players.find(p => p.isSelf) }
  getAlive()         { return this.players.filter(p => p.status === 'alive') }
  getMafiaMembers()  { return this.players.filter(p => p.role === ROLES.MAFIA) }
  getAliveCount()    { return this.players.filter(p => p.status === 'alive').length }
  getDeadCount()     { return this.players.filter(p => p.status === 'dead').length }

  /** Serialized snapshot for React state */
  snapshot() {
    return {
      players: this.players.map(p => ({ ...p })),
      phase: this.phase,
      round: this.round,
      winner: this.winner,
      events: [...this.events],
      lastNightResult: this.lastNightResult,
      lastVoteResult: this.lastVoteResult,
      investigationResult: this.investigationResult,
      votesCast: { ...this.votesCast },
      self: this.getSelf(),
    }
  }

  /* ── Internal ── */
  _resetVotes() {
    this.players.forEach(p => { p.votes = 0 })
    this.votesCast = {}
  }

  _event(icon, text) {
    this.events.push({ icon, text, time: now() })
  }
}
