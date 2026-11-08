import { useAPI } from '@/contexts/API'

type Props = {
  enabled?: boolean
}

// The QR code changes every few seconds. Ask again exactly when the server says to: it already
// spreads phones out so they don't all refresh in the same second. On failure the last code stays
// on screen (it is still valid for one more interval) and the query retries.
export const useCheckInQR = (props?: Props) => {
  return useAPI().useQuery(['checkInQRGet', null], {
    enabled: props?.enabled,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: (data) => (data ? Math.max(data.refresh_in_ms, 1000) : 3000),
  })
}
