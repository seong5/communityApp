import CommentCard from '@/components/CommentCard'
import Button from '@/components/common/Button'
import FeedCard from '@/components/FeedCard'
import { colors } from '@/constants/colors'
import { useAuthQuery } from '@/hooks/useAuthQuery'
import { useCommentListQuery } from '@/hooks/useCommentListQuery'
import { useCreateCommentMutation } from '@/hooks/useCreateCommentMutation'
import { useToggleLikeMutation } from '@/hooks/useToggleLikeMutation'
import { supabase } from '@/libs/supabase'
import type { FeedPost } from '@/types'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

const TABLE = 'post'

export default function FeedDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [data, setData] = useState<FeedPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const postId = typeof id === 'string' ? id : null
  const [commentContent, setCommentContent] = useState('')

  const { data: session } = useAuthQuery()
  const isLoggedIn = Boolean(session)

  const {
    data: comments = [],
    isLoading: commentsLoading,
    isFetching: commentsFetching,
    error: commentsError,
    refetch: refetchComments,
  } = useCommentListQuery({ postId, mode: 'tree' })
  const isCommentsLoading = commentsLoading || commentsFetching
  const { mutate: createComment, isPending: isCreatingComment } = useCreateCommentMutation()
  const { mutate: toggleLike } = useToggleLikeMutation()
  const isSubmitDisabled = useMemo(
    () => isCreatingComment || !commentContent.trim() || !isLoggedIn,
    [isCreatingComment, commentContent, isLoggedIn]
  )

  const handleLikePress = useCallback(() => {
    if (!data || !postId) return
    if (!isLoggedIn) {
      Alert.alert('로그인이 필요합니다.', '좋아요를 누르려면 로그인이 필요합니다.')
      return
    }

    const currentIsLiked = data.isLiked ?? false
    toggleLike(
      { postId, isLiked: currentIsLiked },
      {
        onSuccess: () => {
          setData((prev) => {
            if (!prev) return prev
            return {
              ...prev,
              isLiked: !currentIsLiked,
              likeCount: (prev.likeCount ?? 0) + (currentIsLiked ? -1 : 1),
            }
          })
        },
      }
    )
  }, [data, postId, isLoggedIn, toggleLike])

  const fetchDetail = useCallback(async () => {
    if (!postId) return
    setError(null)
    setLoading(true)

    const { data: post, error: postErr } = await supabase
      .from(TABLE)
      .select('id, title, description, user_id, created_at, image_url')
      .eq('id', postId)
      .single()

    if (postErr) {
      setError(postErr.message)
      setData(null)
      setLoading(false)
      return
    }

    let author: FeedPost['author'] | undefined = undefined
    if (post?.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, nickname, imageUri')
        .eq('id', post.user_id)
        .maybeSingle()
      if (profile) {
        author = {
          id: profile.id,
          nickname: profile.nickname ?? '',
          imageUri: profile.imageUri ?? undefined,
        }
      }
    }

    const { count: commentCount, error: commentCountError } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .eq('is_deleted', false)

    if (commentCountError) {
      console.error('Error fetching comment count:', commentCountError)
    }

    const { count: likeCount, error: likeError } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)

    if (likeError) {
      console.error('Error fetching like count:', likeError)
    }

    let isLiked = false
    if (session?.user?.id) {
      const { data: likeData } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', session.user.id)
        .maybeSingle()

      isLiked = !!likeData
    }

    let imageUris: { uri: string }[] = []
    if (post.image_url) {
      try {
        const parsed = JSON.parse(post.image_url)
        const urls = Array.isArray(parsed) ? parsed : [post.image_url]
        imageUris = urls.map((uri: string) => ({ uri }))
      } catch {
        imageUris = [{ uri: post.image_url }]
      }
    }

    const mapped: FeedPost = {
      id: String(post.id),
      title: post.title ?? '',
      description: post.description ?? '',
      userId: String(post.user_id),
      createdAt: post.created_at,
      imageUris,
      author: author ?? {
        id: String(post.user_id),
        nickname: '알 수 없음',
        imageUri: undefined,
      },
      commentCount: commentCount ?? 0,
      likeCount: likeCount ?? 0,
      isLiked,
    }

    setData(mapped)
    setLoading(false)
  }, [postId, session?.user?.id])

  useEffect(() => {
    if (!postId) return
    fetchDetail()
    refetchComments()
  }, [fetchDetail, refetchComments, postId])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([fetchDetail(), refetchComments()])
    setRefreshing(false)
  }, [fetchDetail, refetchComments])

  const handleSubmitComment = useCallback(() => {
    if (!postId) return

    if (!isLoggedIn) {
      Alert.alert('로그인이 필요합니다.', '댓글을 작성하려면 로그인이 필요합니다.', [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그인',
          onPress: () => router.push('/auth/login'),
        },
      ])
      return
    }

    const trimmed = commentContent.trim()
    if (!trimmed) {
      Alert.alert('알림', '댓글 내용을 입력해주세요.')
      return
    }

    createComment(
      { postId, content: trimmed },
      {
        onSuccess: () => {
          setCommentContent('')
          refetchComments()
          fetchDetail()
        },
      }
    )
  }, [commentContent, createComment, postId, refetchComments, isLoggedIn, router, fetchDetail])

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  if (error || !data) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, marginBottom: 8 }}>게시글을 불러오지 못했습니다.</Text>
        {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      </View>
    )
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: 12, backgroundColor: colors.GRAY_100 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <FeedCard feed={data} isDetail onLikePress={handleLikePress} />
      <View style={styles.commentSection}>
        <Text style={styles.commentTitle}>댓글</Text>
        <View style={styles.commentInputContainer}>
          <TextInput
            value={commentContent}
            onChangeText={setCommentContent}
            placeholder={isLoggedIn ? '댓글을 입력해주세요.' : '로그인이 필요합니다.'}
            multiline
            style={styles.commentTextInput}
            editable={!isCreatingComment && isLoggedIn}
            placeholderTextColor={colors.GRAY_600}
            onFocus={() => {
              if (!isLoggedIn) {
                Alert.alert('로그인이 필요합니다.', '댓글을 작성하려면 로그인이 필요합니다.', [
                  {
                    text: '취소',
                    style: 'cancel',
                  },
                  {
                    text: '로그인',
                    onPress: () => router.push('/auth/login'),
                  },
                ])
              }
            }}
          />
          <Button
            label={isCreatingComment ? '작성 중...' : '댓글 등록'}
            onPress={handleSubmitComment}
            disabled={isSubmitDisabled}
          />
        </View>
        {isCommentsLoading ? <ActivityIndicator /> : null}
        {commentsError ? <Text style={{ color: 'red' }}>댓글을 불러오지 못했습니다.</Text> : null}
        {!isCommentsLoading && comments.length === 0 ? (
          <Text style={{ color: colors.GRAY_600 }}>첫 댓글을 남겨보세요.</Text>
        ) : null}
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  commentSection: {
    marginTop: 20,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.GRAY_800,
  },
  commentInputContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 12,
  },
  commentTextInput: {
    minHeight: 80,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.GRAY_200,
    borderRadius: 8,
    fontSize: 14,
    color: colors.GRAY_800,
    textAlignVertical: 'top',
  },
})
