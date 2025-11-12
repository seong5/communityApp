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

const mapRowsToFeedPosts = (rows: PostRow[]): FeedPost[] =>
  rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    createdAt: row.created_at,
    author: {
      id: row.user_id,
      nickname: '익명',
      imageUri: '',
    },
    imageUris: row.image_url
      ? [
          {
            uri: row.image_url,
          },
        ]
      : [],
  }))

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
      return mapRowsToFeedPosts(rows)
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
      return mapRowsToFeedPosts(rows)
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length,
  })
  return mode === 'single' ? singleQuery : infiniteQuery
}
