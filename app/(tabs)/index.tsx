import Button from '@/components/common/Button'
import FeedList from '@/components/FeedList'
import { useAuthQuery } from '@/hooks/useAuthQuery'
import { useLogout } from '@/hooks/useLogout'
import { router } from 'expo-router'
import React, { useCallback } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const { confirmLogout, isPending } = useLogout()
  const { data: session } = useAuthQuery()
  const isLoggedIn = Boolean(session)

  const handlePressPost = useCallback(() => {
    if (!isLoggedIn) {
      Alert.alert('로그인이 필요합니다.', '글을 작성하려면 로그인이 필요합니다.', [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그인',
          onPress: () => router.push('/auth/login'),
        },
      ])
      return
    }
    router.push('/posting/PostFeed')
  }, [isLoggedIn])

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {!isLoggedIn ? (
          <Button label="로그인/회원가입" size="md" onPress={() => router.push('/auth')} />
        ) : null}
        {isLoggedIn ? (
          <Button label="로그아웃" size="md" onPress={confirmLogout} disabled={isPending} />
        ) : null}
      </View>
      <FeedList />
      <View style={[styles.fixedButtonContainer, { bottom: 10 }]}>
        <Button label="글쓰기" size="lg" onPress={handlePressPost} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexDirection: 'row-reverse',
    marginRight: 16,
  },
  fixedButtonContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 1000,
  },
})
