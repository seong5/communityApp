import { colors } from '@/constants/colors'
import type { CommentTreeNode } from '@/hooks/useCommentListQuery'
import { StyleSheet, Text, View } from 'react-native'

interface CommentCardProps {
  comment: CommentTreeNode
  depth?: number
}

export default function CommentCard({ comment, depth = 0 }: CommentCardProps) {
  const isDeleted = comment.isDeleted
  const content = isDeleted ? '삭제된 댓글입니다.' : comment.content
  const nickname = isDeleted ? '삭제된 사용자' : (comment.user.nickname ?? '익명')

  return (
    <View style={[styles.wrapper, depth > 0 && { marginLeft: 12 * depth }]}>
      <View style={styles.container}>
        <Text style={styles.nickname}>{nickname}</Text>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.timestamp}>{new Date(comment.createdAt).toLocaleString()}</Text>
      </View>
      {comment.replies.map((reply) => (
        <CommentCard key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
  },
  container: {
    backgroundColor: colors.WHITE,
    padding: 16,
    borderRadius: 10,
    gap: 6,
  },
  nickname: {
    fontWeight: '600',
    fontSize: 14,
    color: colors.GRAY_800,
  },
  content: {
    fontSize: 14,
    color: colors.GRAY_800,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: colors.GRAY_600,
  },
})
