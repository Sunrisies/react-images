import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { request } from '@/utils/fetch'
import { ArticleFormValues, articleSchema } from '@/utils/schemas'
import { uploadImage } from '@/utils/update'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
interface TypeOptions {
  value: number
  label: string
}

const getTags = async (): Promise<TypeOptions[]> => {
  const { data, code } = await request.get<TypeOptions[]>(`/tags`)
  if (code === 200) {
    return data
  }
  return []
}
const getCategories = async (): Promise<TypeOptions[]> => {
  const { data, code } = await request.get<TypeOptions[]>(`/categories`)
  if (code === 200) {
    return data
  }
  return []
}


export function ArticlePublishForm({ onSubmit, onCancel }: { onSubmit: (values: ArticleFormValues) => void, onCancel: () => void }) {

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      category: undefined,
      tags: '',
      summary: '',
      coverImage: ''
    }
  })


  const [tags, setTags] = useState<TypeOptions[]>([])
  const [categories, setCategories] = useState<TypeOptions[]>([])
  useEffect(() => {
    getTags().then((data) => {
      setTags(data)
    })
    getCategories().then((data) => {
      setCategories(data)
    })
  }, [])
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = await uploadImage(file)
      form.setValue('coverImage', url)
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
              <FormLabel className="w-20 leading-10">
                分类<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.value}
                      type="button"
                      className={`${form.getValues('category') === category.value.toString() ? 'bg-green-500 text-white' : 'bg-white text-gray-500'
                        }`}
                      onClick={() => form.setValue('category', category.value.toString())}
                    >
                      {category.label}
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
            <FormItem className="flex items-center">
              <FormLabel className="w-20 ">
                添加标签<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={(e) => { form.setValue('tags', e) }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="请选择标签" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {tags.map((tag) => (
                        <SelectItem key={tag.value} value={tag.value.toString()}>{tag.label}</SelectItem>
                      ))}

                    </SelectGroup>
                  </SelectContent>
                </Select>

              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem className="flex">
          <FormLabel className="w-20 leading-10">文章封面</FormLabel>
          <div>
            <FormControl>
              <div
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
                style={{ width: '192px', height: '128px' }}
                onClick={() => document.getElementById('coverUpload')?.click()}
              >
                {form.getValues('coverImage') ? (
                  <img src={form.getValues('coverImage')} alt="Cover" className="w-full h-full object-cover" />
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
          name="summary"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel className="w-20 leading-10">
                编辑摘要<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl className="flex-1">
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
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button type="submit" >确定并发布</Button>
        </div>
      </form>
    </Form>
  )
}