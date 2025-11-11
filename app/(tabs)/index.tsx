import Button from '@/components/common/Button'
import FeedList from '@/components/FeedList'
import { useAuthRequireQuery } from '@/hooks/useAuthRequireQuery'
import { useLogout } from '@/hooks/useLogout'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  useAuthRequireQuery()

  const { mutate: logout, isPending } = useLogout()

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Button label="로그인/회원가입" size="md" onPress={() => router.push('/auth')} />
        <Button label="로그아웃" size="md" onPress={() => logout()} disabled={isPending} />
        <Button label="글쓰기" size="md" onPress={() => router.push('/posting/PostFeed')} />
      </View>
      <FeedList />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
})
