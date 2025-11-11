import Button from '@/components/common/Button'
import FeedList from '@/components/FeedList'
import { router } from 'expo-router'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Button label="로그인/회원가입" size="md" onPress={() => router.push('/auth')} />
      <Button label="글쓰기" size="md" onPress={() => router.push('/posting/PostFeed')} />
      <FeedList />
    </SafeAreaView>
  )
}
