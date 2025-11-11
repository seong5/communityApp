import { supabase } from '@/libs/supabase'
import { useQuery } from '@tanstack/react-query'

export const useAuthQuery = () => {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession()
      return data.session
    },
    staleTime: 1000 * 60 * 5,
  })
}
