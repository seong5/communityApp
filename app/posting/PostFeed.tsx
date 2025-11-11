import DescriptionText from '@/components/DescriptionText'
import TitleText from '@/components/TitleText'
import { FormProvider, useForm } from 'react-hook-form'

type PostFormValues = {
  title: string
  description: string
}

export default function PostFeed() {
  const postForm = useForm<PostFormValues>({
    defaultValues: {
      title: '',
      description: '',
    },
  })

  return (
    <FormProvider {...postForm}>
      <TitleText />
      <DescriptionText />
    </FormProvider>
  )
}
