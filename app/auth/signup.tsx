import Button from '@/components/common/Button'
import EmailInput from '@/components/EmailInput'
import NicknameInput from '@/components/NicknameInput'
import PasswordConfirmInput from '@/components/PasswordConfirmInput'
import PasswordInput from '@/components/PasswordInput'
import { supabase } from '@/libs/supabase'
import { useNavigation } from '@react-navigation/native'
import { FormProvider, useForm } from 'react-hook-form'
import { Alert, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type SignupFormValues = {
  email: string
  nickname: string
  password: string
  passwordConfirm: string
}

export default function SignupScreen() {
  const navigation: any = useNavigation()
  const signupForm = useForm<SignupFormValues>({
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
      passwordConfirm: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (values: SignupFormValues) => {
    const { email, nickname, password } = values
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname },
      },
    })

    if (error) {
      Alert.alert('회원가입 실패', error.message ?? '다시 시도해주세요.')
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        nickname: nickname,
      })

      if (profileError) {
        console.error('프로필 저장 실패:', profileError)
        Alert.alert(
          '프로필 저장 실패',
          `프로필 저장 중 오류가 발생했습니다: ${profileError.message}. 로그인 후 프로필을 확인해주세요.`
        )
      } else {
      }
    }

    Alert.alert('회원가입에 성공했습니다.', '로그인 페이지로 이동합니다.', [
      {
        text: '확인',
        onPress: () => {
          navigation.navigate('login')
        },
      },
    ])

    signupForm.reset()
  }

  const inset = useSafeAreaInsets()

  return (
    <FormProvider {...signupForm}>
      <View style={styles.container}>
        <EmailInput />
        <NicknameInput />
        <PasswordInput />
        <PasswordConfirmInput />
      </View>
      <View style={[styles.fixed, { paddingBottom: inset.bottom || 12 }]}>
        <Button
          label="회원가입하기"
          variant="primary"
          onPress={signupForm.handleSubmit(onSubmit)}
        />
      </View>
    </FormProvider>
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
