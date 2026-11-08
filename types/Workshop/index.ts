export type WorkshopClaimReq = {
  event_id: number
  token: string
}

export type WorkshopClaimResp = {
  points_awarded: number
  // true on a repeat scan: the backend answers 200 with points_awarded 0 instead of 409
  already_claimed?: boolean
  total_points: number
  event_title: string
}

export type WorkshopRedemption = {
  event_title: string
  points_awarded: number
  redeemed_at: string
}

export type PointAdjustment = {
  delta: number
  adjustment_type: 'manual_adjustment' | 'prize_redemption'
  reason: string
  adjusted_at: string
}

export type UserPointsResp = {
  total_points: number
  redemptions: WorkshopRedemption[]
  adjustments: PointAdjustment[]
}

export type QRTokenResp = {
  token: string
}

export type RecentClaimant = {
  username: string
  avatar: string
  discord_id: string
  redeemed_at: string
}

export type EventRedemptionsResp = {
  redemptions: RecentClaimant[]
}

export type PointAdjustReq = {
  discord_id: string
  delta: number
  adjustment_type: 'manual_adjustment' | 'prize_redemption'
  reason: string
}

export type PointAdjustResp = {
  new_total: number
}
