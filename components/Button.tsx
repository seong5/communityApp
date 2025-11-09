import React from 'react'
import { Pressable, PressableProps, StyleSheet, Text } from 'react-native'

interface ButtonProps extends PressableProps {
  label: string
  size?: 'lg' | 'md' | 'sm'
  variant?: 'primary' | 'secondary'
}

export default function Button({ label, size = 'lg', variant = 'primary', ...props }: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        styles[size],
        styles[variant],
        pressed && styles.pressed,
      ]}
      {...props}
    >
      <Text style={styles[variant]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lg: {
    width: '100%',
    height: 44,
  },
  md: { width: 100, height: 38 },
  sm: { width: 50, height: 30 },
  primary: {
    backgroundColor: '#b0a0e3',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  secondary: {
    backgroundColor: '#ec4899',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.7,
  },
})
