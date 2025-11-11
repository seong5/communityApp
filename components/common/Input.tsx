import { colors } from '@/constants/colors'
import React from 'react'
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native'

interface InputProps extends TextInputProps {
  label?: string
  variant?: 'primary' | 'second' | 'third'
  error?: string
}

export default function Input({ label, variant = 'primary', error = '', ...props }: InputProps) {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.container,
          styles[variant],
          props.multiline && styles.multiline,
          Boolean(error) && styles.inputError,
        ]}
      >
        <TextInput style={styles.input} placeholderTextColor={colors.GRAY_800} {...props} />
      </View>
      {Boolean(error) && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  label: {
    fontSize: 12,
    color: colors.GRAY_800,
    marginBottom: 5,
  },
  primary: {
    backgroundColor: colors.GRAY_100,
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
  error: {
    fontSize: 12,
    marginTop: 7,
    color: colors.RED,
  },
  inputError: {
    borderColor: colors.RED,
  },
  multiline: {
    height: 250,
    paddingVertical: 15,
  },
})
