export type ConnectProfileResp = {
  name: string
  avatar_url: string
  linkedin_url: string
  networking_id: string
}

export type ConnectResp = {
  already_connected: boolean
  connections: number
  name: string
  linkedin_url: string
}
