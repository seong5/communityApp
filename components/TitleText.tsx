import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import Input from './common/Input'

export default function TitleText() {
  const { control } = useFormContext()

  return (
    <Controller
      name="title"
      control={control}
      rules={{
        validate: (data: string) => {
          if (data.length < 3) {
            return '제목을 입력해주세요.'
          }
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          label="제목"
          placeholder="제목을 입력해주세요."
          value={value}
          onChangeText={onChange}
          submitBehavior="submit"
          error={error?.message}
        />
      )}
    />
  )
}
