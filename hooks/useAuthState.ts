import { supabase } from '@/libs/supabase'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export default function useAuthState() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
    })
    return () => subscription.subscription.unsubscribe()
  }, [queryClient])
}
