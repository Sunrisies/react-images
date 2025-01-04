import { useEffect, useState, FC } from 'react'

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Pagination, Tag, Button } from 'antd'
import { useDeleteArticle, useUpdateArticle } from '@/services/article'
import { ArticleType } from '@/types/article.types'
import dayjs from 'dayjs'

const columnHelper = createColumnHelper<ArticleType>()
type ActionButtonProps = {
  label: string
  activeLabel: string
  isActive: boolean
  onClick: () => void
}
const ActionButton = ({ label, activeLabel, isActive, onClick }: ActionButtonProps) => (
  <Button
    type={isActive ? 'primary' : 'dashed'}
    style={{
      backgroundColor: isActive ? 'var(--success-color)' : 'var(--error-color)',
      color: 'var(--text-color)',
      borderColor: isActive ? 'var(--success-color)' : 'var(--error-color)'
    }}
    onClick={onClick}
  >
    {isActive ? activeLabel : label}
  </Button>
)
type TableProps = {
  list: ArticleType[]
  total: number
  onChangePage: (page: number) => void
}

export const Table: FC<TableProps> = ({ list, total, onChangePage }) => {
  const { mutate } = useDeleteArticle()
  const { mutate: updateArticle } = useUpdateArticle()
  const columns = [
    columnHelper.accessor('id', {
      id: 'id',
      header: '序号'
    }),
    columnHelper.accessor('title', {
      id: 'title',
      header: '标题'
    }),
    columnHelper.accessor('cover', {
      id: 'cover',
      header: '头像',
      cell: ({ row }) => <img src={row.original.cover} alt={row.original.title} className="" width="30" height="30" />
    }),
    columnHelper.accessor('category', {
      id: 'category',
      header: '标签',
      cell: ({ row }) => <Tag color="blue">{row.original.category.name}</Tag>
    }),
    columnHelper.accessor('publish_time', {
      id: 'publish_time',
      header: '发布时间',
      cell: ({ row }) => <span>{dayjs(row.original.publish_time).format('YYYY-MM-DD HH:mm:ss')}</span>
    }),
    columnHelper.accessor('is_delete', {
      id: 'is_delete',
      header: '是否删除',
      cell: ({ row }) => {
        return <Tag color={row.original.is_delete ? 'red' : 'green'}>{row.original.is_delete ? '删除' : '正常'}</Tag>
      }
    }),
    columnHelper.accessor('is_hide', {
      id: 'is_hide',
      header: '是否显示',
      cell: ({ row }) => {
        return <Tag color={row.original.is_recommend ? 'purple' : 'green'}>{row.original.is_hide ? '隐藏' : '显示'}</Tag>
      }
    }),
    columnHelper.accessor('views', {
      id: 'views',
      header: '浏览量'
    }),
    columnHelper.accessor('is_top', {
      id: 'is_top',
      header: '是否置顶',
      cell: ({ row }) => {
        return <Tag color={row.original.is_recommend ? 'purple' : 'green'}>{row.original.is_top ? '置顶' : '不置顶'}</Tag>
      }
    }),
    columnHelper.accessor('is_recommend', {
      id: 'is_recommend',
      header: '是否推荐',
      cell: ({ row }) => {
        return <Tag color={row.original.is_recommend ? 'purple' : 'green'}>{row.original.is_recommend ? '推荐' : '不推荐'}</Tag>
      }
    }),
    columnHelper.group({
      header: '操作',
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center space-x-2 gap-1">
            {row.original.is_delete ? null : (
              <Button
                onClick={() => {
                  mutate(row.original.id)
                  console.log(row.original)
                }}
              >
                删除
              </Button>
            )}
            <Button
              onClick={() => {
                console.log(row.original)
              }}
            >
              编辑
            </Button>
            <ActionButton
              label="隐藏"
              activeLabel="显示"
              isActive={row.original.is_hide}
              onClick={() => updateArticle({ id: row.original.id, is_hide: !row.original.is_hide })}
            />

            <ActionButton
              label="置顶"
              activeLabel="取消置顶"
              isActive={row.original.is_top}
              onClick={() => updateArticle({ id: row.original.id, is_top: !row.original.is_top })}
            />

            <ActionButton
              label="推荐"
              activeLabel="取消推荐"
              isActive={row.original.is_recommend}
              onClick={() => updateArticle({ id: row.original.id, is_recommend: !row.original.is_recommend })}
            />
          </div>
        )
      }
    })
  ]
  const [data, setData] = useState(() => [...list])
  useEffect(() => {
    setData([...list])
  }, [list])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })
  return (
    <div className="p-2 flex flex-col justify-between h-full items-center">
      <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow-md">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-200">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border border-gray-300 text-center py-3 px-4 font-semibold text-gray-700">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-gray-300 text-center py-3 px-4 text-gray-600">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination showQuickJumper defaultCurrent={1} total={total} onChange={onChangePage} />
    </div>
  )
}
