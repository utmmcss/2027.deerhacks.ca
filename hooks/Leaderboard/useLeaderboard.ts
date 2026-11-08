import { useAPI } from '@/contexts/API'

type Props = {
  enabled?: boolean
}

// The backend rebuilds the leaderboard every 5 seconds, so polling every 10 is cheap
export const useLeaderboard = (props?: Props) => {
  return useAPI().useQuery(['leaderboardGet', null], {
    enabled: props?.enabled,
    refetchInterval: 10 * 1000,
    refetchOnWindowFocus: true,
  })
}
