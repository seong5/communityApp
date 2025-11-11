import { supabase } from '@/libs/supabase'
import Feather from '@expo/vector-icons/Feather'
import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system/legacy'
import * as ImagePicker from 'expo-image-picker'
import React, { useEffect, useState } from 'react'
import { Alert, Image, Pressable, View } from 'react-native'

type ImageUploadProps = {
  value?: string | null
  onChange?: (url: string | null) => void
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [imageUri, setImageUri] = useState<string | null>(value ?? null)

  useEffect(() => {
    if (value !== undefined) {
      setImageUri(value)
    }
  }, [value])

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: 'images',
    })

    if (result.canceled) {
      return
    }

    const asset = result.assets[0]
    setImageUri(asset.uri)

    try {
      const base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: 'base64',
      })

      const arrayBuffer = decode(base64)

      const filePath = `uploads/${Date.now()}-${asset.fileName ?? 'image.jpg'}`
      const contentType = asset.mimeType ?? 'image/jpeg'

      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, arrayBuffer, { cacheControl: '3600', upsert: false, contentType })

      if (error) throw error

      const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath)
      const publicUrl = urlData.publicUrl

      setImageUri(publicUrl)
      onChange?.(publicUrl)
    } catch (err: any) {
      Alert.alert('이미지 업로드 실패', err.message)
    }
  }

  return (
    <View>
      <Pressable onPress={handleImagePicker}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} />
        ) : (
          <Feather name="image" size={40} color="black" />
        )}
      </Pressable>
    </View>
  )
}
