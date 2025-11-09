import Button from '@/components/Button'
import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Text>테스트</Text>
      <Button label="버튼" variant="primary" size="lg" onPress={() => {}} />
      <Button label="버튼2" variant="secondary" size="md" onPress={() => {}} />
      <Button label="버튼3" variant="primary" size="sm" onPress={() => {}} />
    </SafeAreaView>
  )
}
