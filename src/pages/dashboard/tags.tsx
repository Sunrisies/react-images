// tags-page.tsx
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Layout } from "@/layout"
import { useCreateTag, useDeleteTag, useTags, useUpdateTag } from "@/services/tags"
import { IOptions } from "@/types"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { KeyboardEvent, useState } from "react"
import { toast } from "sonner"

export const Route = createFileRoute("/dashboard/tags")({
  component: TagsPage,
  validateSearch: (search: Record<string, string>) => ({
    page: Number(search?.page ?? 1),
    search: search?.search ?? "",
  }),
})

function TagsPage() {
  const navigate = useNavigate()
  const { page, search: searchQuery } = Route.useSearch()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<IOptions | null>(null)
  const [tagName, setTagName] = useState("")

  const { data, isLoading } = useTags({ search: searchQuery, page, limit: 10 })
  const createTag = useCreateTag()
  const updateTag = useUpdateTag()
  const deleteTag = useDeleteTag()

  const columns = [
    {
      key: "value",
      title: "ID",
    },
    {
      key: "label",
      title: "名称",
    },
  ]

  const handleSubmit = async () => {
    if (!tagName.trim()) {
      toast.error("标签名称不能为空")
      return
    }

    try {
      if (editingTag) {
        await updateTag.mutateAsync({
          id: editingTag.value,
          name: tagName
        })
      } else {
        await createTag.mutateAsync({
          name: tagName
        })
      }
      setIsDialogOpen(false)
      setTagName("")
      setEditingTag(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleEdit = (tag: IOptions) => {
    setEditingTag(tag)
    setTagName(tag.label)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("确定要删除这个标签吗？")) {
      try {
        await deleteTag.mutateAsync(id)
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <Layout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">标签管理</h2>
          <Dialog open={ isDialogOpen } onOpenChange={ setIsDialogOpen }>
            <DialogTrigger asChild>
              <Button
                className="px-4 py-2"
                onClick={ () => {
                  setEditingTag(null)
                  setTagName("")
                } }
              >
                新增标签
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  { editingTag ? "编辑标签" : "新增标签" }
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="请输入标签名称，回车确认"
                  value={ tagName }
                  onChange={ (e) => setTagName(e.target.value) }
                  onKeyDown={ handleKeyDown }
                  autoFocus
                  className="col-span-3"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={ columns }
          data={ data?.data || [] }
          loading={ isLoading }
          search={ {
            placeholder: "搜索标签...",
            onSearch: (value) => {
              navigate({
                to: "/dashboard/tags",
                search: { page: 1, search: value }
              })
            }
          } }
          actions={ {
            render: (record: IOptions) => (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={ () => handleEdit(record) }
                >
                  编辑
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={ () => handleDelete(record.value) }
                >
                  删除
                </Button>
              </>
            )
          } }
          pagination={ {
            current: page,
            total: data?.pagination?.total || 0,
            pageSize: 10,
            onChange: (newPage) => {
              navigate({
                to: "/dashboard/tags",
                search: { page: newPage, search: searchQuery }
              })
            }
          } }
        />
      </div>
    </Layout>
  )
}
