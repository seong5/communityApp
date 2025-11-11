import { colors } from '@/constants/colors'
import React, { ReactNode } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

interface ProfileProps {
  imageUri?: string
  nickname: string
  createdAt: string
  onPress: () => void
  option?: ReactNode
}

export default function Profile({ imageUri, nickname, createdAt, onPress, option }: ProfileProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.profileContainer} onPress={onPress}>
        <Image
          source={imageUri ? { uri: imageUri } : require('../assets/images/icon-user-profile.png')}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.nickname}>{nickname}</Text>
          <Text style={styles.createdAt}>{createdAt}</Text>
        </View>
      </Pressable>
      {option}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  nickname: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  createdAt: {
    fontSize: 13,
    color: colors.GRAY_200,
  },
})
