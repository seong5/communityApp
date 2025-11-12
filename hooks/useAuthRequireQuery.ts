import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Alert } from 'react-native'
import { useAuthQuery } from './useAuthQuery'

type RequireOptions = {
  redirectTo?: string | null
  showAlert?: boolean
  alertMessage?: string
  alertConfirmText?: string
}

export const useAuthRequireQuery = (options?: RequireOptions) => {
  const router = useRouter()
  const { data: session, isLoading } = useAuthQuery()

  const redirectTo = options?.redirectTo ?? '/auth/login'
  const showAlert = options?.showAlert ?? true
  const alertMessage = options?.alertMessage ?? '로그인 페이지로 이동합니다.'
  const alertConfirmText = options?.alertConfirmText ?? '이동'

  useEffect(() => {
    if (isLoading) return

    if (!session) {
      if (!redirectTo) {
        return
      }

      if (showAlert) {
        Alert.alert('로그인이 필요합니다.', alertMessage, [
          {
            text: alertConfirmText,
            onPress: () => {
              router.push('/auth/login')
            },
          },
        ])
        return
      }

      router.push('/')
    }
  }, [session, isLoading, router, redirectTo, showAlert, alertMessage, alertConfirmText])
}
