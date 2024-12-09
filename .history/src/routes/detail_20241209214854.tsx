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
export const Route = createFileRoute('/detail')({
  component: RouteComponent
})
const uploadUrl = 'https://blog.chaoyang1024.top:2345/api/upload/image'
function RouteComponent() {
  const [from, setFrom] = useState({
    title: '',
    category_id: null,
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
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <>
      <div className="flex flex-col gap-3 h-full">
        <div className="flex gap-3 mb-3">
          <Input placeholder="输入文章标题..." onChange={(e) => fromSet(e.target.value, 'title')} />
          <Dialog>
            <DialogTrigger asChild>
              <Button>发布</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>发布文章</DialogTitle>
                <DialogDescription></DialogDescription>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="shadcn" {...field} />
                          </FormControl>
                          <FormDescription>This is your public display name.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-around items-center">
                      <Button>取消</Button>
                      <Button type="submit">确定</Button>
                    </div>
                  </form>
                </Form>
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
