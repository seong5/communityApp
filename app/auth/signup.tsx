import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SignupScreen() {
  const inset = useSafeAreaInsets()
  const [signupValues, setSignupValues] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  })
  const [error, setError] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  })

  const handleSubmit = () => {
    console.log('signupValues', signupValues)
  }

  const handleChangeInput = (text: string, name: string) => {
    setSignupValues((prev) => {
      return { ...prev, [name]: text }
    })
  }
  return (
    <>
      <View style={styles.container}>
        <Input
          label="이메일"
          placeholder="이메일을 입력해주세요."
          value={signupValues.email}
          onChangeText={(text) => handleChangeInput(text, 'email')}
        />
        <Input
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          value={signupValues.password}
          onChangeText={(text) => handleChangeInput(text, 'password')}
        />
        <Input
          label="비밀번호확인"
          placeholder="비밀번호를 확인해주세요."
          value={signupValues.passwordConfirm}
          onChangeText={(text) => handleChangeInput(text, 'passwordConfirm')}
        />
      </View>
      <View style={[styles.fixed, { paddingBottom: inset.bottom || 12 }]}>
        <Button label="회원가입하기" variant="primary" onPress={handleSubmit} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    gap: 20,
  },
  fixed: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 20,
  },
})
