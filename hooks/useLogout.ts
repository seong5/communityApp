import { supabase } from '@/libs/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, type Href } from 'expo-router'
import { Alert } from 'react-native'

export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: async () => {
      await queryClient.resetQueries({ queryKey: ['session'] })
      queryClient.invalidateQueries()
      router.replace('/' as Href)
    },
    onError: (error: any) => {
      Alert.alert('로그아웃 실패', error?.message ?? '다시 시도해 주세요.')
    },
  })

  const confirmLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: () => mutation.mutate(),
      },
    ])
  }

  return { ...mutation, confirmLogout }
}
