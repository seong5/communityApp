import { supabase } from '@/libs/supabase'
import type { Comment } from '@/types'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'

type CommentRow = {
  id: string | number
  post_id: string | number
  user_id: string | number
  content: string
  parent_comment_id: string | number | null
  is_deleted: boolean
  created_at: string
}

export type CommentWithParent = Comment & {
  parentCommentId: string | null
}

export type CommentTreeNode = CommentWithParent & {
  replies: CommentTreeNode[]
}

type CommentListMode = 'flat' | 'tree'

type CommentListOptions<M extends CommentListMode> = {
  postId?: string | null
  mode?: M
}

type CommentListResult<M extends CommentListMode> = M extends 'tree'
  ? CommentTreeNode[]
  : CommentWithParent[]

const mapRowToComment = (
  row: CommentRow,
  profilesMap: Map<
    string,
    {
      nickname: string | null
      imageUri: string | null
    }
  >
): CommentWithParent => {
  const profile = profilesMap.get(String(row.user_id))
  return {
    id: String(row.id),
    content: row.content ?? '',
    createdAt: row.created_at,
    isDeleted: Boolean(row.is_deleted),
    user: {
      id: String(row.user_id),
      nickname: profile?.nickname ?? '익명',
      imageUri: profile?.imageUri ?? undefined,
    },
    parentCommentId: row.parent_comment_id === null ? null : String(row.parent_comment_id),
  }
}

const buildCommentTree = (comments: CommentWithParent[]): CommentTreeNode[] => {
  const lookup = new Map<string, CommentTreeNode>()
  const roots: CommentTreeNode[] = []

  comments.forEach((comment) => {
    lookup.set(comment.id, { ...comment, replies: [] })
  })

  comments.forEach((comment) => {
    const node = lookup.get(comment.id)
    if (!node) return

    if (comment.parentCommentId && lookup.has(comment.parentCommentId)) {
      lookup.get(comment.parentCommentId)!.replies.push(node)
    } else {
      roots.push(node)
    }
  })

  const sortByCreatedAt = (a: CommentTreeNode, b: CommentTreeNode) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()

  const sortTree = (nodes: CommentTreeNode[]) => {
    nodes.sort(sortByCreatedAt)
    nodes.forEach((child) => sortTree(child.replies))
  }

  sortTree(roots)
  return roots
}

export function useCommentListQuery(
  options: CommentListOptions<'tree'>
): UseQueryResult<CommentTreeNode[], Error>
export function useCommentListQuery(
  options?: CommentListOptions<'flat'>
): UseQueryResult<CommentWithParent[], Error>
export function useCommentListQuery<M extends CommentListMode>(
  options?: CommentListOptions<M>
): UseQueryResult<CommentListResult<M>, Error> {
  const mode: CommentListMode = options?.mode ?? 'flat'
  const postId = options?.postId ?? null

  return useQuery<CommentListResult<M>, Error>({
    queryKey: ['comments', postId, mode],
    enabled: Boolean(postId),
    queryFn: async () => {
      if (!postId) return [] as CommentListResult<M>

      const { data, error } = await supabase
        .from('comments')
        .select('id, post_id, user_id, content, parent_comment_id, is_deleted, created_at')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) throw error

      const rows = data as CommentRow[]

      const userIds = [...new Set(rows.map((row) => String(row.user_id)).filter(Boolean))]
      const profilesMap = new Map<
        string,
        {
          nickname: string | null
          imageUri: string | null
        }
      >()

      if (userIds.length > 0) {
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, nickname, imageuri')
          .in('id', userIds)

        if (profileError) {
          console.warn('댓글 프로필 조회 실패:', profileError)
        }

        if (profiles) {
          profiles.forEach((profile) => {
            profilesMap.set(profile.id, {
              nickname: profile.nickname,
              imageUri: (profile as any).imageuri ?? null,
            })
          })
        }
      }

      const comments = rows.map((row) => mapRowToComment(row, profilesMap))

      if (mode === 'tree') {
        return buildCommentTree(comments) as CommentListResult<M>
      }

      return comments as CommentListResult<M>
    },
  })
}
