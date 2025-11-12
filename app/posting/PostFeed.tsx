import Button from '@/components/common/Button'
import DescriptionText from '@/components/DescriptionText'
import ImageUpload from '@/components/ImageUpload'
import PreviewImages from '@/components/PreviewImages'
import TitleText from '@/components/TitleText'
import { supabase } from '@/libs/supabase'
import { router } from 'expo-router'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { Alert, StyleSheet, View } from 'react-native'

type PostFormValues = {
  title: string
  description: string
  imageUrl: string | null
}

export default function PostFeedScreen() {
  const postForm = useForm<PostFormValues>({
    defaultValues: {
      title: '',
      description: '',
      imageUrl: null,
    },
    mode: 'onChange',
  })

  const onSubmit = async (values: PostFormValues) => {
    const { title, description, imageUrl } = values

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      Alert.alert('로그인이 필요합니다.')
      return
    }

    const { error } = await supabase
      .from('post')
      .insert({ title, description, user_id: user.id, image_url: imageUrl })
      .select()

    if (error) {
      Alert.alert('게시물 실패', error.message)
      return
    }
    Alert.alert('게시물 등록 성공')

    postForm.reset()
    router.push('/')
  }

  return (
    <View style={styles.container}>
      <FormProvider {...postForm}>
        <TitleText />
        <DescriptionText />
        <Controller
          name="imageUrl"
          control={postForm.control}
          defaultValue={null}
          render={({ field: { value, onChange } }) => (
            <>
              <ImageUpload value={value} onChange={onChange} />
              <PreviewImages url={value} />
            </>
          )}
        />
        <Button label="게시하기" onPress={postForm.handleSubmit(onSubmit)} />
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
