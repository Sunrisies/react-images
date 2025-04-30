export interface ArticleType {
  id: number
  title: string
  cover: string
  category: {
    id: number
    name: string
  }
  author: string
  publish_time: string
  is_delete: boolean
  is_hide: boolean
  views: number
  is_top: boolean
  is_recommend: boolean
  content: string
  description: string
  comments: any[]
}