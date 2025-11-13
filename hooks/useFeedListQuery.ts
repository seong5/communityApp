import { supabase } from '@/libs/supabase'
import type { FeedPost } from '@/types'
import {
  useInfiniteQuery,
  useQuery,
  type UseInfiniteQueryResult,
  type UseQueryResult,
} from '@tanstack/react-query'

const PAGE_SIZE = 10

type PostRow = {
  id: string
  title: string
  description: string
  created_at: string
  user_id: string
  image_url: string | null
}

const mapRowsToFeedPosts = async (rows: PostRow[]): Promise<FeedPost[]> => {
  // 현재 로그인한 사용자 ID 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const currentUserId = user?.id

  const userIds = [...new Set(rows.map((row) => row.user_id).filter(Boolean))]

  const profilesMap = new Map<string, { nickname: string | null; imageUri: string | null }>()
  if (userIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, nickname, imageuri')
      .in('id', userIds)

    if (profilesError) {
      // 프로필 조회 실패 시 무시
    }

    if (profiles) {
      profiles.forEach((profile: any) => {
        profilesMap.set(profile.id, {
          nickname: profile.nickname,
          imageUri: profile.imageuri ?? profile.image_uri ?? null,
        })
      })
    }
  }

  const postsWithCounts = await Promise.all(
    rows.map(async (row) => {
      const { count: commentCount, error: commentError } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', row.id)
        .eq('is_deleted', false)

      if (commentError) {
        console.error('Error fetching comment count:', commentError)
      }

      const { count: likeCount, error: likeError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', row.id)

      if (likeError) {
        console.error('Error fetching like count:', likeError)
      }

      // 현재 사용자가 좋아요를 눌렀는지 확인
      let isLiked = false
      if (currentUserId) {
        const { data: likeData } = await supabase
          .from('likes')
          .select('id')
          .eq('post_id', row.id)
          .eq('user_id', currentUserId)
          .maybeSingle()

        isLiked = !!likeData
      }

      const profile = profilesMap.get(row.user_id)
      let authorNickname = '익명'
      let authorImageUri = ''

      if (profile) {
        if (profile.nickname) {
          authorNickname = profile.nickname
        }
        authorImageUri = profile.imageUri ?? ''
      }

      return {
        id: row.id,
        userId: row.user_id,
        title: row.title,
        description: row.description,
        createdAt: row.created_at,
        author: {
          id: row.user_id,
          nickname: authorNickname,
          imageUri: authorImageUri,
        },
        imageUris: (() => {
          if (!row.image_url) return []
          try {
            const parsed = JSON.parse(row.image_url)
            const urls = Array.isArray(parsed) ? parsed : [row.image_url]
            return urls.map((uri: string) => ({ uri }))
          } catch {
            return [{ uri: row.image_url }]
          }
        })(),
        commentCount: commentCount ?? 0,
        likeCount: likeCount ?? 0,
        isLiked,
      }
    })
  )

  return postsWithCounts
}

type Mode = 'single' | 'infinite'

export function useFeedListQuery(options?: { mode?: 'single' }): UseQueryResult<FeedPost[], Error>
export function useFeedListQuery(options: {
  mode: 'infinite'
}): UseInfiniteQueryResult<FeedPost[], Error>

export function useFeedListQuery(options?: {
  mode?: Mode
}): UseQueryResult<FeedPost[], Error> | UseInfiniteQueryResult<FeedPost[], Error> {
  const mode: Mode = options?.mode ?? 'single'

  const singleQuery = useQuery<FeedPost[], Error>({
    queryKey: ['posts'],
    enabled: mode === 'single',
    queryFn: async () => {
      const { data, error } = await supabase
        .from('post')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      const rows = data as PostRow[]
      return await mapRowsToFeedPosts(rows)
    },
  })
  /* 무한스크롤 */
  const infiniteQuery = useInfiniteQuery<FeedPost[], Error, FeedPost[], ['posts'], number>({
    queryKey: ['posts'],
    enabled: mode === 'infinite',
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const { data, error } = await supabase
        .from('post')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw error
      const rows = data as PostRow[]
      return await mapRowsToFeedPosts(rows)
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length,
  })
  return mode === 'single' ? singleQuery : infiniteQuery
}
