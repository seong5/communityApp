import React from 'react'
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native'

type PreviewImagesProps = {
  url: string | null
  onPressImage?: (url: string) => void
}

export default function PreviewImages({ url, onPressImage }: PreviewImagesProps) {
  if (!url) {
    return null
  }

  return (
    <View>
      <ScrollView>
        <Pressable onPress={() => onPressImage?.(url)}>
          <Image source={{ uri: url }} style={styles.image} />
        </Pressable>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
})
