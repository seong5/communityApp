import Button from '@/components/common/Button'
import EmailInput from '@/components/EmailInput'
import NicknameInput from '@/components/NicknameInput'
import PasswordConfirmInput from '@/components/PasswordConfirmInput'
import PasswordInput from '@/components/PasswordInput'
import { FormProvider, useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type SignupFormValues = {
  email: string
  password: string
  passwordConfirm: string
}

export default function SignupScreen() {
  const signupForm = useForm<SignupFormValues>({
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
  })

  const onSubmit = (signupFormValues: SignupFormValues) => {
    console.log('signupFormValues', signupFormValues)
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
