import Button from '@/components/common/Button'
import DescriptionText from '@/components/DescriptionText'
import TitleText from '@/components/TitleText'
import { useAuthQuery } from '@/hooks/useAuthQuery'
import { supabase } from '@/libs/supabase'
import { useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Alert, StyleSheet, View } from 'react-native'

type PostFormValues = {
  title: string
  description: string
}

export default function EditFeedScreen() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: session } = useAuthQuery()

  const postForm = useForm<PostFormValues>({
    defaultValues: {
      title: '',
      description: '',
    },
    mode: 'onChange',
  })

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return
      const { data, error } = await supabase
        .from('post')
        .select('title, description, user_id')
        .eq('id', id)
        .single()

      if (error) {
        Alert.alert('게시글을 불러오는데 실패')
        router.back()
        return
      }

      postForm.reset({
        title: data.title,
        description: data.description,
      })
    }
    fetchPost()
  }, [id, session?.user?.id, router, postForm])

  const onSubmit = async (values: PostFormValues) => {
    if (!id) return
    const { title, description } = values

    const { error } = await supabase.from('post').update({ title, description }).eq('id', id)

    if (error) {
      Alert.alert('게시물 수정 실패', error.message)
      return
    }
    queryClient.invalidateQueries({ queryKey: ['posts'] })
    Alert.alert('게시물 수정 성공', '', [{ text: '확인', onPress: () => router.push('/') }])
  }

  return (
    <View style={styles.container}>
      <FormProvider {...postForm}>
        <TitleText />
        <DescriptionText />
        <Button label="수정하기" onPress={postForm.handleSubmit(onSubmit)} />
      </FormProvider>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
    gap: 25,
  },
})
