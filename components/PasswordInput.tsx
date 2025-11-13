import { colors } from '@/constants/colors'
import Feather from '@expo/vector-icons/Feather'
import React, { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Pressable } from 'react-native'
import Input from './common/Input'

export default function PasswordInput() {
  const { control } = useFormContext()
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Controller
      name="password"
      control={control}
      rules={{
        validate: (data: string) => {
          if (data.length < 8) {
            return '비밀번호는 8자 이상 입력해주세요.'
          }
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          value={value}
          onChangeText={onChange}
          secureTextEntry={!isVisible}
          error={error?.message}
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
