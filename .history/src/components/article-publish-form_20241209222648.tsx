import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Popconfirm } from 'antd'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { articleSchema, ArticleFormValues } from '@/schemas/article-schema'

const categories = [
  { id: 'backend', name: '后端' },
  { id: 'frontend', name: '前端' },
  { id: 'android', name: 'Android' },
  { id: 'ios', name: 'iOS' },
  { id: 'ai', name: '人工智能' },
  { id: 'devtools', name: '开发工具' },
  { id: 'codelife', name: '代码人生' },
  { id: 'reading', name: '阅读' }
]

export function ArticlePublishForm() {
  const [coverImage, setCoverImage] = useState<string | null>(null)

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      category: '',
      tags: [],
      column: '',
      topic: '',
      summary: ''
    }
  })

  function onSubmit(values: ArticleFormValues) {
    console.log(values)
    // Handle form submission
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImage(reader.result as string)
        form.setValue('coverImage', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex ">
              <FormLabel className="w-28 leading-10">
                分类<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      type="button"
                      variant={field.value === category.id ? 'default' : 'outline'}
                      onClick={() => field.onChange(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex border items-center">
              <FormLabel className="w-28 leading-10">
                添加标签<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入标签并按Enter添加"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      e.preventDefault()
                      field.onChange([...field.value, e.currentTarget.value])
                      e.currentTarget.value = ''
                    }
                  }}
                />
              </FormControl>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {tag}
                    <button
                      type="button"
                      onClick={() => field.onChange(field.value.filter((_, i) => i !== index))}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem className="flex">
          <FormLabel className="w-28 leading-10">文章封面</FormLabel>
          <div>
            <FormControl>
              <div
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
                style={{ width: '192px', height: '128px' }}
                onClick={() => document.getElementById('coverUpload')?.click()}
              >
                {coverImage ? (
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <span className="text-2xl mb-2">+</span>
                    <span>上传封面</span>
                  </div>
                )}
                <input id="coverUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </FormControl>
            <p className="text-sm text-gray-500 mt-2">建议尺寸：192*128px (封面仅展示在首页信息流中)</p>
          </div>
        </FormItem>

        <FormField
          control={form.control}
          name="column"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel className="w-28 leading-10">收录至专栏</FormLabel>
              <FormControl>
                <Input {...field} placeholder="请搜索添加专栏，同一篇文章最多添加三个专栏" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel className="w-28 leading-10">创作话题</FormLabel>
              <FormControl>
                <Input {...field} placeholder="请搜索添加话题，最多添加1个话题" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel className="w-28">
                编辑摘要<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Textarea
                    {...field}
                    placeholder="请输入文章摘要"
                    className="min-h-[100px]"
                    onChange={(e) => {
                      if (e.target.value.length <= 100) {
                        field.onChange(e)
                      }
                    }}
                  />
                  <span className="absolute bottom-2 right-2 text-gray-400">{field.value?.length || 0}/100</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            取消
          </Button>
          <Button type="submit">确定并发布</Button>
        </div>
      </form>
    </Form>
  )
}
