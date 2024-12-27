import { ArticlePublishForm } from '@/components/article-publish-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Layout } from '@/layout'
import { usePostEdit } from '@/services/edit'
import { UpdateType } from '@/types/edit.types'
import { isLogin } from '@/utils/auth'
import { ArticleFormValues } from '@/utils/schemas'
import { uploadImage } from '@/utils/update'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { MdCatalog, MdEditor } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import { useState } from 'react'
export const Route = createFileRoute('/admin/edit')({
  component: RouteComponent,
  beforeLoad: () => {
    // 判断是否登录
    if (!isLogin()) {
      return redirect({ to: '/auth/login' })
    }
  },
})

function RouteComponent() {
  const [from, setFrom] = useState<UpdateType>({
    title: '',
    category_id: undefined,
    tags: [] as number[],
    cover: '',
    summary: '',
    content: '',
    status: '发布',
    author: '朝阳',
  })
  const fromSet = (e: string, key: string) => {
    console.log(e, 'key:', key)
    if (key === 'tags') {
      setFrom((state) => ({ ...state, [key]: [+e] }))
    } else if (key === 'category_id') {
      setFrom((state) => ({ ...state, [key]: +e }))
    } else {
      setFrom((state) => ({
        ...state,
        [key]: e,
      }))
    }
  }
  const onUploadImg = async (
    files: File[],
    callback: (urls: string[]) => void,
  ) => {
    const res = await uploadImage(files[0])
    callback([res])
  }
  const [state] = useState({
    text: '# 标题',
    scrollElement: document.documentElement,
  })

  const { mutate } = usePostEdit()
  const handleFormSubmit = async ({
    category,
    tags,
    coverImage,
    summary,
  }: ArticleFormValues) => {
    console.log('父组件的数据')
    fromSet(category, 'category_id')
    fromSet(tags, 'tags')
    coverImage && fromSet(coverImage, 'cover')
    summary && fromSet(summary, 'summary')
    update()
  }
  const update = () => {
    mutate(from)
  }
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Layout>
      <div className="flex flex-col gap-3 h-full">
        {/* <Button onClick={() => handleFormSubmit(21)}>123</Button> */}
        <div className="flex gap-3 mb-3">
          <Input
            placeholder="输入文章标题..."
            onChange={(e) => fromSet(e.target.value, 'title')}
          />
          <Dialog open={isModalOpen} onOpenChange={(e) => setIsModalOpen(e)}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsModalOpen(true)}>发布</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>发布文章</DialogTitle>
                <ArticlePublishForm
                  onSubmit={handleFormSubmit}
                  onCancel={() => setIsModalOpen(false)}
                ></ArticlePublishForm>
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
    </Layout>
  )
}
