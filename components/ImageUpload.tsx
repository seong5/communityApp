import Feather from '@expo/vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker'
import React from 'react'
import { Pressable, View } from 'react-native'

export default function ImageUpload() {
  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
    })

    if (result.canceled) {
      return
    }
  }

  return (
    <View>
      <Pressable onPress={handleImagePicker}>
        <Feather name="image" size={40} color="black" />
      </Pressable>
    </View>
  )
}
