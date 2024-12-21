import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { request } from '@/utils/fetch'
import type { FormProps } from 'antd';
interface TypeOptions {
  value: number
  label: string
}
import { Select,SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { SelectProps } from 'antd'

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
type UpdateType = {
  title: string
  content: string
  status: string
  author: string
}
const articleSchema = z.object({
  category: z.string({
    required_error: '请选择一个分类'
  }),
  tags: z.string().min(1, '请至少添加一个标签'),
  coverImage: z.string().optional(),
  summary: z.string().max(100, '摘要不能超过100个字符').optional()
})
type ArticleFormValues = z.infer<typeof articleSchema>
export function ArticlePublishForm({onSubmit }:{onSubmit : (values: ArticleFormValues) => void}) {
  const [coverImage, setCoverImage] = useState<string | null>(null)

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      category: undefined,
      tags: '',
      summary: ''
    }
  })


  const [imageUrl, setImageUrl] = useState<string>()
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
          <Button type="button" variant="outline">
            取消
          </Button>
          <Button type="submit">确定并发布</Button>
        </div>
      </form>
    </Form>
  )
}


// return (
//   <Form
//     name="basic"
//     labelCol={{ span: 8 }}
//     wrapperCol={{ span: 16 }}
//     style={{ maxWidth: 600 }}
//     initialValues={{ remember: true }}
//     onFinish={onFinish}
//     onFinishFailed={onFinishFailed}
//     autoComplete="off"
//   >
//     <Form.Item<FieldType> label="分类" name="category" rules={[{ required: true, message: 'Please input your username!' }]}>
//       <div className="flex flex-wrap gap-2">
//         {categories.map((category) => (
//           <Button
//             key={category.value}
//             type="button"
//             className={`${from.category_id === category.value ? 'bg-green-500 text-white' : 'bg-white text-gray-500'
//               }`}
//             onClick={() => fromSet(category.value, 'category_id')}
//           >
//             {category.label}
//           </Button>
//         ))}
//       </div>
//     </Form.Item>

//     <Form.Item<FieldType> label="标签" name="tags" rules={[{ required: true, message: 'Please input your password!' }]}>
//       <Select
//         mode="multiple"
//         allowClear
//         style={{ width: '100%' }}
//         placeholder="Please select"
//         // onChange={() => { console.log('change') }}
//         options={options}
//       />
//     </Form.Item>

//     <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
//       <Checkbox>Remember me</Checkbox>
//     </Form.Item>

//     {/* <Form.Item label={null}>
//       <Button type="primary" htmlType="submit">
//         Submit
//       </Button>
//     </Form.Item> */}
//   </Form>
// )