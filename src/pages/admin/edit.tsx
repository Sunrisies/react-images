import { ArticlePublishForm } from '@/components/article-publish-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Layout } from '@/layout'
import { usePostEdit } from '@/services/edit'
import { UpdateType } from '@/types/edit.types'
import { isLogin } from '@/utils/auth'
import { ArticleFormValues } from '@/utils/schemas'
import { uploadImage } from '@/utils/update'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { message } from 'antd'
import { MdCatalog, MdEditor } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import { useState } from 'react'
import { useImmer } from 'use-immer'

const DEFAULT_ARTICLE = {
  title: '',
  category_id: undefined,
  tags: [] as number[],
  cover: '',
  summary: '',
  content: '',
  status: '发布',
  author: '朝阳'
}

const useArticleForm = () => {
  const [form, setForm] = useImmer<UpdateType>(DEFAULT_ARTICLE)
  const updateField = <K extends keyof UpdateType>(value: UpdateType[K], key: K) => {
    setForm((draft) => {
      draft[key] = value
    })
  }

  const resetForm = () => {
    setForm(DEFAULT_ARTICLE)
  }

  return { form, updateField, resetForm }
}
interface ArticleEditorProps {
  content: string // 编辑器内容
  onContentChange: (content: string) => void // 内容变化回调
  onUploadImg: (files: File[], callback: (urls: string[]) => void) => void // 图片上传回调
}
const ArticleEditor = ({ content, onContentChange, onUploadImg }: ArticleEditorProps) => {
  const [state] = useState({
    text: '',
    scrollElement: document.documentElement
  })

  return (
    <>
      <MdEditor modelValue={content} className="flex-1" onChange={onContentChange} onUploadImg={onUploadImg} />
      <MdCatalog editorId="my-editor" scrollElement={state.scrollElement} />
    </>
  )
}

export const Route = createFileRoute('/admin/edit')({
  component: RouteComponent,
  beforeLoad: () => {
    if (!isLogin()) {
      return redirect({ to: '/auth/login' })
    }
  }
})

function RouteComponent() {
  const { mutateAsync } = usePostEdit()
  const { form, updateField, resetForm } = useArticleForm()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
    const res = await uploadImage(files[0])
    callback([res])
  }

  const formSubmit = async ({ category, tags, coverImage, summary }: ArticleFormValues) => {
    const updatedForm = {
      ...form,
      category_id: +category,
      tags: tags.map((item) => item.value),
      cover: coverImage,
      summary: summary!
    }

    try {
      const code = await mutateAsync(updatedForm)
      if (code === 200) {
        message.success('发布成功')
        resetForm()
        setIsModalOpen(false)
      } else {
        message.error('发布失败')
      }
    } catch (error) {
      message.error('请求失败')
    }
  }

  return (
    <Layout>
      <div className="flex flex-col gap-3 h-full">
        <div className="flex gap-3 mb-3">
          <Input placeholder="输入文章标题..." value={form.title} onChange={(e) => updateField(e.target.value, 'title')} />
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsModalOpen(true)}>发布</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>发布文章</DialogTitle>
                <ArticlePublishForm onSubmit={formSubmit} onCancel={() => setIsModalOpen(false)} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <ArticleEditor content={form.content} onContentChange={(e) => updateField(e, 'content')} onUploadImg={onUploadImg} />
      </div>
    </Layout>
  )
}
