import FeedCard from '@/components/FeedCard'
import { colors } from '@/constants/colors'
import { supabase } from '@/libs/supabase'
import type { FeedPost } from '@/types'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native'

const TABLE = 'post'

export default function FeedDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [data, setData] = useState<FeedPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDetail = useCallback(async () => {
    if (!id) return
    setError(null)
    setLoading(true)

    // 1) 게시글 단건 조회 (snake_case → camelCase 매핑)
    const { data: post, error: postErr } = await supabase
      .from(TABLE)
      .select('id, title, description, user_id, created_at, image_url')
      .eq('id', id)
      .single()

    if (postErr) {
      setError(postErr.message)
      setData(null)
      setLoading(false)
      return
    }

    // 2) 작성자 프로필 조회 (테이블/컬럼명은 프로젝트에 맞게)
    //    profiles 테이블이 있고, id=users.id 로 저장된다고 가정
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

    const mapped: FeedPost = {
      id: String(post.id),
      title: post.title ?? '',
      description: post.description ?? '',
      userId: String(post.user_id),
      createdAt: post.created_at,
      imageUris: post.image_url ? [{ uri: post.image_url }] : [],
      author: author ?? {
        id: String(post.user_id),
        nickname: '알 수 없음',
        imageUri: undefined,
      },
    }

    setData(mapped)
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchDetail()
    setRefreshing(false)
  }, [fetchDetail])

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
      <FeedCard feed={data} isDetail />
    </ScrollView>
  )
}
