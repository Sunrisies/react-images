export type UpdateType = {
  title: string
  content: string
  status: string
  author: string
  categoryId: number | undefined
  tagIds: number[]
  cover?: string
  description: string
  size: number
}
export type addArticleType = {
  code: number
  data: {
    id: number
    title: string
    content: string
    category_id: number
    cover: string
    author: string
    publish_time: string
    update_time: string
    views: number
    is_top: boolean
    is_recommend: boolean
    is_delete: boolean
    is_publish: boolean
    is_hide: boolean
    summary: string
  }
}