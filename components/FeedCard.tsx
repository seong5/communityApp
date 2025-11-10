import { colors } from '@/constants/colors'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Octicons from '@expo/vector-icons/Octicons'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

export default function FeedCard() {
  const isLiked = false

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>제목</Text>
        <Text style={styles.description}>내용</Text>
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
})
