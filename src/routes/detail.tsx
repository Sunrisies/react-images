import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { MdCatalog, MdEditor } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ArticlePublishForm } from '@/components/article-publish-form'
import { Select, SelectProps } from 'antd'
export const Route = createFileRoute('/detail')({
  component: RouteComponent
})
const articleSchema = z.object({
  category: z.string({
    required_error: '请选择一个分类'
  }),
  tags: z.string().min(1, '请至少添加一个标签'),
  coverImage: z.string().optional(),
  summary: z.string().max(100, '摘要不能超过100个字符').optional()
})
type ArticleFormValues = z.infer<typeof articleSchema>
const uploadUrl = 'https://blog.chaoyang1024.top:2345/api/upload/image'
type UpdateType = {
  title: string
  content: string
  status: string
  author: string
  category_id: string
  tags: number[]
  cover: string
  summary: string
}
function RouteComponent() {
  const [from, setFrom] = useState<UpdateType>({
    title: '',
    category_id: '',
    tags: [] as number[],
    cover: '',
    summary: '',
    content: '',
    status: '发布',
    author: '朝阳'
  })
  const fromSet = (e: string, key: string) => {
    console.log(e, 'key:', key)
    if (key === 'tags') {
      setFrom(() => ({ ...from, [key]: [+e] }))
    } else {
      setFrom(() => ({ ...from, [key]: e }))
    }
  }
  const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
    const res = (await Promise.all(
      files.map((file) => {
        return new Promise((rev, rej) => {
          const form = new FormData()
          const timestamp = new Date().getTime()
          const randomNum = Math.floor(Math.random() * 10000)
          const fileName = `${timestamp}_${randomNum}_${file.name}`
          form.append('file', file, fileName)
          fetch(uploadUrl, {
            method: 'POST',
            body: form,
            redirect: 'follow'
          })
            .then((res) => rev(res.json()))
            .catch((error) => rej(error))
        })
      })
    )) as { code: number; url: string }[]
    console.log(res, 'res')
    callback(res.map((item) => item.url))
  }
  const [state] = useState({
    text: '# 标题',
    scrollElement: document.documentElement
  })
  const formSchema = z.object({
    username: z.string().min(2, { message: '用户名至少需要2个字符' }).max(50, { message: '用户名最多需要50个字符' })
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: ''
    }
  })

  function handleFormSubmit({ category, tags, coverImage, summary }: ArticleFormValues) {
    console.log('父组件的数据')
    fromSet(category, 'category_id')
    fromSet(tags, 'tags')
    coverImage && fromSet(coverImage, 'cover')
    summary && fromSet(summary, 'summary')
    console.log(from, 'from',coverImage)
  }

  return (
    <>
      <div className="flex flex-col gap-3 h-full">
        <div className="flex gap-3 mb-3">
          <Input placeholder="输入文章标题..." onChange={(e) => fromSet(e.target.value, 'title')} />
          <Dialog >
            <DialogTrigger asChild>
              <Button>发布</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader >
                <DialogTitle>发布文章</DialogTitle>
                <ArticlePublishForm onSubmit={handleFormSubmit}></ArticlePublishForm>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <MdEditor
          modelValue={from.content}
          className="flex-1"
          onChange={(e) => fromSet(e, 'content')}
          onUploadImg={onUploadImg}
        />
        <MdCatalog editorId="my-editor" scrollElement={state.scrollElement} />
      </div>
    </>
  )
}
