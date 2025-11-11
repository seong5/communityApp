import { colors } from '@/constants/colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Link, Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: colors.WHITE } }}>
      <Stack.Screen
        name="index"
        options={{
          title: '로그인',
          headerShown: true,
          headerLeft: () => (
            <Link href={'/'} replace>
              <Ionicons name="chevron-back" size={24} color="black" />
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: '이메일 로그인',
          headerShown: true,
          headerBackButtonDisplayMode: 'minimal',
          headerLeft: () => (
            <Link href={'/'} replace>
              <Ionicons name="chevron-back" size={24} color="black" />
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: '회원가입',
          headerShown: true,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
    </Stack>
  )
}
