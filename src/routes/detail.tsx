import { ArticlePublishForm } from '@/components/article-publish-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { request } from '@/utils/fetch'
import { createFileRoute } from '@tanstack/react-router'
import { message } from 'antd'
import { MdCatalog, MdEditor } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import { ArticleFormValues } from '@/utils/schemas'
import { useState } from 'react'
import { uploadImage } from '@/utils/update'
import { Login } from '@/components/login'
export const Route = createFileRoute('/detail')({
  component: RouteComponent
})

type UpdateType = {
  title: string
  content: string
  status: string
  author: string
  category_id: number | undefined
  tags: number[]
  cover: string
  summary: string
}
type addArticleType = {
  code: number;
  data: {
    id: number;
    title: string;
    content: string;
    category_id: number;
    cover: string;
    author: string;
    publish_time: string;
    update_time: string;
    views: number;
    is_top: boolean;
    is_recommend: boolean;
    is_delete: boolean;
    is_publish: boolean;
    is_hide: boolean;
    summary: string;
  }

}
// 发布文章接口
const publishArticle = async (from: UpdateType, callback: () => void) => {
  console.log(from, '上传文件')
  const { code, data } = await request.post<UpdateType, addArticleType>(`/article`, from)
  console.log(data, 'code, data')
  if (code === 200) {
    message.success('发布成功');
  } else {
    message.error('发布失败');
  }
  callback()
  return data
};

function RouteComponent() {
  const [from, setFrom] = useState<UpdateType>({
    title: '',
    category_id: undefined,
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
      setFrom((state) => ({ ...state, [key]: [+e] }))
    } else if (key === 'category_id') {
      setFrom((state) => ({ ...state, [key]: +e }))
    } else {
      setFrom((state) => ({
        ...state, [key]: e
      })
      )
    }
  }
  const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
    const res = await uploadImage(files[0])
    callback([res])
  }
  const [state] = useState({
    text: '# 标题',
    scrollElement: document.documentElement
  })


  const handleFormSubmit = ({ category, tags, coverImage, summary }: ArticleFormValues) => {
    console.log('父组件的数据')
    fromSet(category, 'category_id')
    fromSet(tags, 'tags')
    coverImage && fromSet(coverImage, 'cover')
    summary && fromSet(summary, 'summary')
    console.log(from, 'from')
    publishArticle(from, () => {
      setIsModalOpen(false)
    })
  }
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex gap-3 mb-3">
        <Input placeholder="输入文章标题..." onChange={(e) => fromSet(e.target.value, 'title')} />
        <Dialog open={isModalOpen} onOpenChange={(e) => setIsModalOpen(e)}>
          <DialogTrigger asChild>
                <Button>发布</Button>
            {/* <Button onClick={() => setIsModalOpen(true)}>发布</Button> */}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader >
              <DialogTitle>发布文章</DialogTitle>
              <Login></Login>
              {/* <ArticlePublishForm onSubmit={handleFormSubmit} onCancel={() => setIsModalOpen(false)}></ArticlePublishForm> */}
            </DialogHeader>
          </DialogContent>
        </Dialog>
        {/* <Dialog>
          <DialogTrigger asChild> <Button>预览</Button> </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
              </DialogTitle></DialogHeader>
            <Login></Login>
          </DialogContent>
        </Dialog> */}
      </div>
      <MdEditor
        modelValue={from.content}
        className="flex-1"
        onChange={(e) => fromSet(e, 'content')}
        onUploadImg={onUploadImg}
      />
      <MdCatalog editorId="my-editor" scrollElement={state.scrollElement} />
    </div>
  )
}
