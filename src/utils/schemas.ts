import { z } from 'zod'
export const articleSchema = z.object({
  description: z.string().min(10, '摘要不能少于10个字符').max(250, '摘要不能超过250个字符').optional(),
  categoryId: z.string({
    required_error: '请选择一个分类'
  }),
  tagIds: z.array(z.number()).min(1, '请至少添加一个标签'),
  // coverImage: z.string().optional(),
})
export type ArticleFormValues = z.infer<typeof articleSchema>

export const thirdSchema = z.object({
  name: z.string().min(1, '名称不能为空').max(50, '名称不能超过50个字符'),
  officialUrl: z.string().url('请输入有效的URL地址'),
  categoryId: z.string({ required_error: '请选择分类' }).min(1, '请选择分类'),
  tagIds: z.array(z.number()).min(1, '请至少选择一个标签'),
  description: z.string().min(10, '描述不能少于10个字符').max(250, '描述不能超过250个字符').optional(),
})

export type ThirdFormValues = z.infer<typeof thirdSchema>