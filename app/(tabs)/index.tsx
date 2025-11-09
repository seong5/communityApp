import Button from '@/components/Button'
import Input from '@/components/Input'
import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Text>테스트</Text>
      <Button label="버튼" variant="primary" size="lg" onPress={() => {}} />
      <Input label="테스트인풋" placeholder="테스트입니다" variant="primary" />
      <Input label="테스트인풋2" placeholder="테스트입니다2" variant="second" />
      <Input label="테스트인풋3" placeholder="테스트입니다3" variant="third" />
    </SafeAreaView>
  )
}
