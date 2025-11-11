import Button from '@/components/common/Button'
import { useAuthRequireQuery } from '@/hooks/useAuthRequireQuery'
import { useLogout } from '@/hooks/useLogout'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function MyProfileScreen() {
  useAuthRequireQuery()

  const { mutate: logout, isPending } = useLogout()

  return (
    <SafeAreaView>
      <Text>마이페이지</Text>
      <Button label="로그아웃" onPress={() => logout()} disabled={isPending} />
    </SafeAreaView>
  )
}
