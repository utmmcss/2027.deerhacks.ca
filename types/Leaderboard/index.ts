export type LeaderboardEntry = {
  rank: number
  username: string
  avatar_url: string
  points: number
  connections: number
}

export type LeaderboardMe = {
  rank: number | null
  points: number
  connections: number
}

// Hackers get only { visible: false } while an admin has the leaderboard hidden
export type LeaderboardResp = {
  visible: boolean
  updated_at?: string
  top?: LeaderboardEntry[]
  // null for staff, who are never ranked
  me?: LeaderboardMe | null
}
