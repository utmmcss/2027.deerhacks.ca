import { useAPI } from '@/contexts/API'

export const useConnect = () => {
  return useAPI().useMutation('connectCreate')
}
