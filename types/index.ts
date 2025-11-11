interface User {
  id: string
  nickname: string
  imageUri?: string
}

interface Profile extends User {
  email: string
  introduce?: string
  hatId: string
  handId: string
  skinId: string
  topId: string
  faceId: string
  bottomId: string
  background: string
}

interface ImageUri {
  id?: string
  uri: string
}

interface CreatePostDto {
  title: string
  description: string
  imageUris: ImageUri[]
}

interface CreateCommentDto {
  content: string
  postId: number
  parentCommentId?: number
}

interface Comment {
  id: string
  content: string
  createdAt: string
  user: User
  isDeleted: boolean
}

interface FeedPost {
  id: string
  userId: string
  title: string
  description: string
  createdAt: string
  author: User
  imageUris: ImageUri[]
}

export type { Comment, CreateCommentDto, CreatePostDto, FeedPost, ImageUri, Profile }
