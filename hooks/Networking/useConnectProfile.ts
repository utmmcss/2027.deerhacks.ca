import { useAPI } from '@/contexts/API'

export const useConnectProfile = (id: string) => {
  return useAPI().useQuery(['connectProfileGet', { id }], {
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: false,
    // Keep showing the profile while the URL switches from the QR code to the permanent id
    keepPreviousData: true,
  })
}
