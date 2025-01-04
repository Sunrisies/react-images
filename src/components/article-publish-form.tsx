import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { request } from '@/utils/fetch'
import { ArticleFormValues, articleSchema } from '@/utils/schemas'
import { uploadImage } from '@/utils/update'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import Select, { MultiValue } from 'react-select'
type TypeOptions = {
  value: number
  label: string
}

const getTags = async (): Promise<TypeOptions[]> => {
  const { data, code } = await request.get<TypeOptions[]>(`/tags`)
  return code === 200 ? data : []
}
const getCategories = async (): Promise<TypeOptions[]> => {
  const { data, code } = await request.get<TypeOptions[]>(`/categories`)
  return code === 200 ? data : []
}
type ArticlePublishProps = {
  readonly onSubmit: (values: ArticleFormValues) => void
  readonly onCancel: () => void
}
export function ArticlePublishForm({ onSubmit, onCancel }: ArticlePublishProps) {
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      category: undefined,
      tags: [],
      summary: '',
      coverImage: ''
    }
  })

  const {
    data: tags,
    isLoading: isTagsLoading,
    isError: isTagsError
  } = useQuery<TypeOptions[]>({
    queryKey: ['tags'], // 查询的唯一标识
    queryFn: getTags // 查询函数
  })

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError
  } = useQuery<TypeOptions[]>({
    queryKey: ['categories'], // 查询的唯一标识
    queryFn: getCategories // 查询函数
  })
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = await uploadImage(file)
      form.setValue('coverImage', url)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel className="w-20">
                分类<span className="text-red-500">*</span>
              </FormLabel>
              <div className="flex flex-col gap-2 justify-center items-center">
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {isCategoriesLoading ? (
                      <p>加载中...</p>
                    ) : isCategoriesError ? (
                      <p>加载分类失败</p>
                    ) : (
                      categories?.map((category) => (
                        <Button
                          key={category.value}
                          type="button"
                          className={`${
                            form.getValues('category') === category.value.toString()
                              ? 'bg-green-500 text-white'
                              : 'bg-white text-gray-500'
                          }`}
                          onClick={() => form.setValue('category', category.value.toString())}
                        >
                          {category.label}
                        </Button>
                      ))
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex items-center !mt-2">
              <FormLabel className="w-20">
                添加标签<span className="text-red-500">*</span>
              </FormLabel>
              <div className="flex flex-col flex-1 max-w-full">
                <FormControl>
                  {isTagsLoading ? (
                    <p>加载中...</p>
                  ) : isTagsError ? (
                    <p>加载标签失败</p>
                  ) : (
                    <Select
                      onChange={(e: MultiValue<TypeOptions>) => {
                        const selectedTags = e.map((option) => ({
                          value: option.value,
                          label: option.label
                        }))
                        form.setValue('tags', selectedTags)
                      }}
                      isMulti
                      name="tags"
                      options={tags}
                      className="flex-1"
                      classNamePrefix="select"
                    />
                  )}
                </FormControl>
                <FormMessage className="mt-2 ml-4" />
              </div>
            </FormItem>
          )}
        />

        <FormItem className="flex !mt-2">
          <FormLabel className="w-20 leading-10 ">文章封面</FormLabel>
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
            <FormItem className="flex !mt-2">
              <FormLabel className="w-20 leading-10">
                编辑摘要<span className="text-red-500">*</span>
              </FormLabel>
              <div className="flex flex-col gap-2 flex-1">
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
                <FormMessage className="ml-4" />
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button type="submit">确定并发布</Button>
        </div>
      </form>
    </Form>
  )
}
