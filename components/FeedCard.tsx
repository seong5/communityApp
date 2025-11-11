import { colors } from '@/constants/colors'
import { useAuthQuery } from '@/hooks/useAuthQuery'
import { useDeleteMutation } from '@/hooks/useDeleteFeedMutation'
import { FeedPost } from '@/types'
import { useActionSheet } from '@expo/react-native-action-sheet'
import Feather from '@expo/vector-icons/Feather'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Octicons from '@expo/vector-icons/Octicons'
import { router } from 'expo-router'
import React from 'react'
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import Profile from './Profile'

interface FeedCardProps {
  feed: FeedPost
}

export default function FeedCard({ feed }: FeedCardProps) {
  const isLiked = false
  const { data: session } = useAuthQuery()
  const currentLoginId = session?.user?.id
  const isMyPost = currentLoginId === feed.userId
  const { showActionSheetWithOptions } = useActionSheet()
  const { mutate: deleteFeed } = useDeleteMutation()
  const firstImage = feed.imageUris[0]

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

  return (
    <View style={styles.container}>
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
        {firstImage && firstImage.uri ? (
          <Image source={{ uri: firstImage.uri }} style={styles.images} />
        ) : null}
      </View>
      <View style={styles.menuContent}>
        <Pressable style={styles.menu}>
          <Octicons
            name={isLiked ? 'heart-fill' : 'heart'}
            size={22}
            color={isLiked ? colors.RED : colors.BLACK}
          />
          <Text style={styles.menuNumber}>2</Text>
        </Pressable>
        <Pressable style={styles.menu}>
          <MaterialCommunityIcons name="message-reply-outline" size={22} color="black" />
          <Text style={styles.menuNumber}>2</Text>
        </Pressable>
        <Pressable style={styles.menu}>
          <Octicons name="share" size={22} color="black" />
        </Pressable>
      </View>
    </View>
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
  images: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
})
