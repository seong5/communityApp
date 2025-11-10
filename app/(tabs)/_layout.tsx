import { colors } from '@/constants/colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import Octicons from '@expo/vector-icons/Octicons'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.PURPLE,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, focused }) => (
            <Octicons name={focused ? 'home-fill' : 'home'} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="myProfile"
        options={{
          title: '프로필',
          tabBarIcon: ({ color, focused }) => (
            <Octicons name={focused ? 'person-fill' : 'person'} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: '설정',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
