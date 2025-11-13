import { colors } from '@/constants/colors'
import { useAuthQuery } from '@/hooks/useAuthQuery'
import { useDeleteMutation } from '@/hooks/useDeleteFeedMutation'
import { useToggleLikeMutation } from '@/hooks/useToggleLikeMutation'
import { FeedPost } from '@/types'
import { useActionSheet } from '@expo/react-native-action-sheet'
import Feather from '@expo/vector-icons/Feather'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Octicons from '@expo/vector-icons/Octicons'
import * as Clipboard from 'expo-clipboard'
import { router } from 'expo-router'
import React from 'react'
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Profile from './Profile'

interface FeedCardProps {
  feed: FeedPost
  isDetail?: boolean
  onLikePress?: () => void
}

export default function FeedCard({ feed, isDetail = false, onLikePress }: FeedCardProps) {
  const { data: session } = useAuthQuery()
  const currentLoginId = session?.user?.id
  const isMyPost = currentLoginId === feed.userId
  const { showActionSheetWithOptions } = useActionSheet()
  const { mutate: deleteFeed } = useDeleteMutation()
  const { mutate: toggleLike } = useToggleLikeMutation()
  const images = feed.imageUris
  const isLiked = feed.isLiked ?? false
  const likeCount = feed.likeCount ?? 0

  const handlePressLike = () => {
    if (!session) {
      Alert.alert('로그인이 필요합니다.', '좋아요를 누르려면 로그인이 필요합니다.')
      return
    }

    if (onLikePress) {
      onLikePress()
    } else {
      toggleLike({ postId: feed.id, isLiked })
    }
  }

  const handlePressOption = () => {
    const options = ['수정하기', '삭제하기', '취소']
    const cancelButtonIndex = 2
    const destructiveButtonIndex = 1

    showActionSheetWithOptions(
      { options, cancelButtonIndex, destructiveButtonIndex },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            {
              router.push({
                pathname: '/posting/EditFeed',
                params: { id: String(feed.id) },
              })
            }
            break
          case destructiveButtonIndex:
            {
              Alert.alert('삭제하기', '정말 삭제하시겠습니까?', [
                { text: '취소', style: 'cancel' },
                {
                  text: '삭제',
                  style: 'destructive',
                  onPress: () => {
                    deleteFeed(feed.id)
                  },
                },
              ])
            }
            break
          case cancelButtonIndex:
            break
          default:
            break
        }
      }
    )
  }
  const handlePressGotoDetail = () => {
    if (!isDetail) {
      router.push(`/posting/${feed.id}`)
    }
  }

  const handlePressShare = async () => {
    try {
      const link = `communityapp://posting/${feed.id}`
      await Clipboard.setStringAsync(link)
      Alert.alert('링크 복사됨', '피드 링크가 클립보드에 복사되었습니다.')
    } catch (error) {
      Alert.alert('복사 실패', '링크 복사에 실패했습니다.')
    }
  }

  const GoToDetail = isDetail ? View : Pressable

  return (
    <GoToDetail onPress={handlePressGotoDetail} style={styles.container}>
      <View style={styles.content}>
        <Profile
          nickname={feed.author.nickname}
          imageUri={feed.author.imageUri}
          createdAt={feed.createdAt}
          onPress={() => {}}
          option={
            isMyPost ? (
              <Pressable>
                <Feather name="more-vertical" size={24} color="black" onPress={handlePressOption} />
              </Pressable>
            ) : null
          }
        />
        <Text style={styles.title}>{feed.title}</Text>
        <Text style={styles.description}>{feed.description}</Text>
        {images && images.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageContainer}
          >
            {images.map((image, index) => (
              <Image key={index} source={{ uri: image.uri }} style={styles.images} />
            ))}
          </ScrollView>
        ) : null}
      </View>
      <View style={styles.menuContent}>
        <Pressable style={styles.menu} onPress={handlePressLike}>
          <Octicons
            name={isLiked ? 'heart-fill' : 'heart'}
            size={22}
            color={isLiked ? colors.RED : colors.BLACK}
          />
          <Text style={styles.menuNumber}>{likeCount}</Text>
        </Pressable>
        <Pressable style={styles.menu}>
          <MaterialCommunityIcons name="message-reply-outline" size={22} color="black" />
          <Text style={styles.menuNumber}>{feed.commentCount ?? 0}</Text>
        </Pressable>
        <Pressable style={styles.menu} onPress={handlePressShare}>
          <Octicons name="share" size={22} color="black" />
        </Pressable>
      </View>
    </GoToDetail>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderRadius: 10,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.BLACK,
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    color: colors.BLACK,
    marginBottom: 14,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopColor: colors.GRAY_100,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  menu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 3,
  },
  menuNumber: {
    fontSize: 14,
  },
  imageContainer: {
    marginTop: 8,
  },
  images: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginRight: 10,
  },
})
