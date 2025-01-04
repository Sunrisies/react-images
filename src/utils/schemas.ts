import { z } from 'zod'
const tagSchema = z.object({
  value: z.number(), // 标签的值
  label: z.string(), // 标签的显示文本
});
export const articleSchema = z.object({
  category: z.string({
    required_error: '请选择一个分类'
  }),
  tags: z.array(tagSchema).min(1, '请至少添加一个标签'),
  coverImage: z.string().optional(),
  summary: z.string().min(10,'摘要不能少于10个字符').max(100, '摘要不能超过100个字符').optional()
})
export type ArticleFormValues = z.infer<typeof articleSchema>