import { supabase } from '@/libs/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert } from 'react-native'

export const useDeleteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.from('post').delete().eq('id', postId)

      if (error) {
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (error: any) => {
      Alert.alert('삭제 요청에 실패했습니다.', error.message)
    },
  })
}
