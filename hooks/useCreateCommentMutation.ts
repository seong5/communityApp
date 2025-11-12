import { supabase } from '@/libs/supabase'
import type { CreateCommentDto } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert } from 'react-native'

type CreateCommentPayload = Omit<CreateCommentDto, 'parentCommentId'> & {
  parentCommentId?: string | null
}

export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, content, parentCommentId }: CreateCommentPayload) => {
      const trimmed = content.trim()
      if (!trimmed) {
        throw new Error('댓글 내용을 입력해주세요.')
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error('로그인이 필요합니다.')
      }

      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        user_id: user.id,
        content: trimmed,
        parent_comment_id: parentCommentId ?? null,
      })

      if (error) {
        throw error
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] })
    },
    onError: (error: any) => {
      const message = error?.message ?? '댓글 작성에 실패했습니다. 다시 시도해주세요.'
      Alert.alert('댓글 작성 실패', message)
    },
  })
}
