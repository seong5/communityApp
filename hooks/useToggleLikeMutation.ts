import { supabase } from '@/libs/supabase'
import type { FeedPost } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert } from 'react-native'

export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error('로그인이 필요합니다.')
      }

      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('likes').insert({
          post_id: postId,
          user_id: user.id,
        })

        if (error) throw error
      }
    },
    onMutate: async ({ postId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] })

      const previousData = queryClient.getQueryData(['posts'])

      queryClient.setQueryData(['posts'], (old: any) => {
        if (!old) return old

        if (Array.isArray(old)) {
          return old.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                isLiked: !isLiked,
                likeCount: (post.likeCount ?? 0) + (isLiked ? -1 : 1),
              }
            }
            return post
          })
        }

        if (old && typeof old === 'object' && 'pages' in old) {
          return {
            ...old,
            pages: old.pages.map((page: FeedPost[]) =>
              page.map((post) => {
                if (post.id === postId) {
                  return {
                    ...post,
                    isLiked: !isLiked,
                    likeCount: (post.likeCount ?? 0) + (isLiked ? -1 : 1),
                  }
                }
                return post
              })
            ),
          }
        }

        return old
      })

      return { previousData }
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['posts'], context.previousData)
      }
      Alert.alert('오류', err.message ?? '좋아요 처리에 실패했습니다.')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
