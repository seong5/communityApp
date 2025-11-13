import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import Input from './common/Input'

export default function NicknameInput() {
  const { control } = useFormContext()

  return (
    <Controller
      name="nickname"
      control={control}
      rules={{
        validate: (data: string) => {
          if (data.length < 2) {
            return '닉네임은 2자 이상 입력해주세요.'
          }
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          label="닉네임"
          inputMode="text"
          placeholder="닉네임을 입력해주세요."
          value={value}
          onChangeText={onChange}
          submitBehavior="submit"
          error={error?.message}
          autoCapitalize="none"
        />
      )}
    />
  )
}
