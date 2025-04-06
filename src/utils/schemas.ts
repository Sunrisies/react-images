import { number, z } from 'zod'
const tagSchema = z.object({
  value: z.number(), // 标签的值
  label: z.string(), // 标签的显示文本
});
export const articleSchema = z.object({
  description: z.string().min(10, '摘要不能少于10个字符').max(250, '摘要不能超过250个字符').optional(),
  categoryId: z.string({
    required_error: '请选择一个分类'
  }),
  tagIds: z.array(z.number()).min(1, '请至少添加一个标签'),
  // coverImage: z.string().optional(),
})
export type ArticleFormValues = z.infer<typeof articleSchema>