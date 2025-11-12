import { colors } from '@/constants/colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Link, Stack } from 'expo-router'

export default function PostingLayout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: colors.WHITE } }}>
      <Stack.Screen
        name="PostFeed"
        options={{
          title: '게시물 작성',
          headerShown: true,
          headerLeft: () => (
            <Link href={'/'} replace>
              <Ionicons name="chevron-back" size={24} color="black" />
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="EditFeed"
        options={{
          title: '게시물 수정',
          headerShown: true,
          headerLeft: () => (
            <Link href={'/'} replace>
              <Ionicons name="chevron-back" size={24} color="black" />
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: '상세 페이지',
          headerShown: true,
          headerLeft: () => (
            <Link href={'/'} replace>
              <Ionicons name="chevron-back" size={24} color="black" />
            </Link>
          ),
        }}
      />
    </Stack>
  )
}
