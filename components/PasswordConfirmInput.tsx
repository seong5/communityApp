import { colors } from '@/constants/colors'
import Feather from '@expo/vector-icons/Feather'
import React, { useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Pressable } from 'react-native'
import Input from './common/Input'

export default function PasswordConfirmInput() {
  const { control } = useFormContext()
  const passwordWatch = useWatch({ control, name: 'password' })
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Controller
      name="passwordConfirm"
      control={control}
      rules={{
        validate: (data: string) => {
          if (data !== passwordWatch) {
            return '비밀번호가 일치하지 않습니다.'
          }
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          label="비밀번호 확인"
          placeholder="비밀번호를 한 번 더 입력해주세요."
          value={value}
          onChangeText={onChange}
          error={error?.message}
          secureTextEntry={!isVisible}
          rightIcon={
            <Pressable onPress={() => setIsVisible(!isVisible)}>
              <Feather name={isVisible ? 'eye-off' : 'eye'} size={20} color={colors.GRAY_600} />
            </Pressable>
          }
        />
      )}
    />
  )
}
