import { APIError } from '@/api/types'
import { useAPI } from '@/contexts/API'
import { User } from '@/types/User'

type Props = {
  enabled?: boolean
  onSuccess?: () => void
  onError?: (err: unknown) => void
}

export const isUnauthorized = (err: unknown) => (err as APIError)?.apiError?.status === 401

/** IMPORTANT: Do not use this directly, use useAuth */
export const useUserGet = (props?: Props) => {
  return useAPI().useQuery(['userGet', null], {
    enabled: props?.enabled,
    // 401 means logged out. Anything else (503 busy, 429, network) keeps retrying with backoff
    // (up to 30s apart), so pages show a spinner until the server recovers instead of a 401 page
    retry: (_, err) => !isUnauthorized(err),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      data.user.avatar = getAvatar(data.user)
      props?.onSuccess?.()
    },
    onError: props?.onError,
  })
}

/**
 * https://discord.com/developers/docs/reference#image-formatting-image-base-url
 */
export const getAvatar = (user: User) => {
  const avatar = user.avatar
  if (avatar)
    return `https://cdn.discordapp.com/avatars/${user.discord_id}/${avatar}.${
      avatar.startsWith('a_') ? 'gif' : 'webp'
    }`
  else {
    const index = (BigInt(user.discord_id) >> BigInt(22)) % BigInt(6)
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`
  }
}
