import { colors } from '@/constants/colors'
import React from 'react'
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native'

interface InputProps extends TextInputProps {
  label?: string
  variant?: 'primary' | 'second' | 'third'
}

export default function Input({ label, variant = 'primary', ...props }: InputProps) {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.container, styles[variant]]}>
        <TextInput style={styles.input} {...props} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: colors.GRAY_800,
    marginBottom: 5,
  },
  primary: {
    backgroundColor: colors.GRAY_200,
  },
  second: {
    borderWidth: 2,
    borderColor: colors.PURPLE,
    color: colors.PURPLE,
  },
  third: {
    borderWidth: 2,
    borderColor: colors.GRAY_600,
  },
  input: {
    fontSize: 16,
    padding: 0,
    flex: 1,
  },
})
