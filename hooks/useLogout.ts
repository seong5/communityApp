import { supabase } from '@/libs/supabase'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'

export const useLogout = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      router.replace('/')
    },
    onError: (error: any) => {
      Alert.alert('로그아웃 실패', error.message ?? '다시 시도해 주세요.')
    },
  })
}
