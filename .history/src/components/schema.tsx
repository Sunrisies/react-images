import * as z from "zod"

export const articleSchema = z.object({
  category: z.string({
    required_error: "请选择一个分类",
  }),
  tags: z.array(z.string()).min(1, "请至少添加一个标签"),
  coverImage: z.string().optional(),
  column: z.string().optional(),
  topic: z.string().optional(),
  summary: z.string().max(100, "摘要不能超过100个字符").optional(),
})

export type ArticleFormValues = z.infer<typeof articleSchema>

