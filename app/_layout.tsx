import useAuthState from '@/hooks/useAuthState'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import 'react-native-reanimated'

export const unstable_settings = {
  anchor: '(tabs)',
}

const queryClient = new QueryClient()

function AuthStateWrapper() {
  useAuthState()
  return null
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthStateWrapper />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
    </QueryClientProvider>
  )
}
