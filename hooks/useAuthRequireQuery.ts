import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Alert } from 'react-native'
import { useAuthQuery } from './useAuthQuery'

export const useAuthRequireQuery = () => {
  const router = useRouter()
  const { data: session, isLoading } = useAuthQuery()

  useEffect(() => {
    if (isLoading) return

    if (!session) {
      Alert.alert('로그인이 필요합니다.', '로그인 페이지로 이동합니다.', [
        {
          text: '이동',
          onPress: () => {
            router.replace('/auth/login')
          },
        },
      ])
    }
  }, [session, isLoading, router])
}
