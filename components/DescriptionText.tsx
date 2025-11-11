import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import Input from './common/Input'

export default function DescriptionText() {
  const { control } = useFormContext()

  return (
    <Controller
      name="description"
      control={control}
      rules={{
        validate: (data: string) => {
          if (data.length < 10) {
            return '내용을 10자 이상 입력해주세요.'
          }
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          label="내용"
          placeholder="내용을 입력해주세요."
          value={value}
          onChangeText={onChange}
          error={error?.message}
          multiline
        />
      )}
    />
  )
}
