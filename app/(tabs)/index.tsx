import Button from '@/components/common/Button'
import FeedList from '@/components/FeedList'
import { useAuthQuery } from '@/hooks/useAuthQuery'
import { useLogout } from '@/hooks/useLogout'
import { router } from 'expo-router'
import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const { confirmLogout, isPending } = useLogout()
  const { data: session } = useAuthQuery()
  const isLoggedIn = Boolean(session)

  const handlePressPost = useCallback(() => {
    if (!isLoggedIn) {
      router.push('/auth/login')
      return
    }
    router.push('/posting/PostFeed')
  }, [isLoggedIn])

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {!isLoggedIn ? (
          <Button label="로그인/회원가입" size="md" onPress={() => router.push('/auth')} />
        ) : null}
        {isLoggedIn ? (
          <Button label="로그아웃" size="md" onPress={confirmLogout} disabled={isPending} />
        ) : null}
        <Button label="글쓰기" size="md" onPress={handlePressPost} />
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
