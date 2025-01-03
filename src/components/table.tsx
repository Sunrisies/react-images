import React, { useEffect, useState } from 'react'

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Pagination, PaginationProps, Tag } from 'antd'
// import { Button } from './ui/button'
import { Button } from 'antd'
import { ArticleType } from '@/types/article.types'
import dayjs from 'dayjs'
import { useDeleteArticle, useUpdateArticle } from '@/services/article'

const columnHelper = createColumnHelper<ArticleType>()
const ActionButton = ({
  label,
  activeLabel,
  isActive,
  onClick
}: {
  label: string
  activeLabel: string
  isActive: boolean
  onClick: () => void
}) => (
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

export const Table: React.FC<{ list: ArticleType[],total: number,onChangePage: (page: number) => void }> = ({ list,total,onChangePage }) => {
  const { mutate } = useDeleteArticle()
  const { mutate: updateArticle, isIdle } = useUpdateArticle()
  const columns = [
    columnHelper.accessor('id', {
      id: 'id',
      header: '序号',
      footer: (info) => console.log(info, 'info')
    }),
    columnHelper.accessor('title', {
      id: 'title',
      header: '标题',
      footer: (info) => console.log(info, 'info')
    }),
    columnHelper.accessor('cover', {
      id: 'cover',
      header: '头像',
      cell: ({ row }) => <img src={row.original.cover} alt={row.original.title} width="50" height="50" />,
      footer: (info) => console.log(info, 'info')
    }),
    columnHelper.accessor('category', {
      id: 'category',
      header: '标签',
      cell: ({ row }) => <Tag color="blue">{row.original.category.name}</Tag>,
      footer: (info) => console.log(info, 'info')
    }),
    columnHelper.accessor('publish_time', {
      id: 'publish_time',
      header: '发布时间',
      cell: ({ row }) => <span>{dayjs(row.original.publish_time).format('YYYY-MM-DD HH:mm:ss')}</span>,
      footer: (info) => console.log(info, 'info')
    }),
    columnHelper.accessor('is_delete', {
      id: 'is_delete',
      header: '是否删除',
      cell: ({ row }) => {
        return <Tag color={row.original.is_delete ? 'red' : 'green'}>{row.original.is_delete ? '删除' : '正常'}</Tag>
      },
      footer: (info) => <Tag color="purple">1231231 {info.column.id}</Tag>
    }),
    columnHelper.accessor('is_hide', {
      id: 'is_hide',
      header: '是否显示',
      cell: ({ row }) => {
        return <Tag color={row.original.is_recommend ? 'purple' : 'green'}>{row.original.is_hide ? '隐藏' : '显示'}</Tag>
      },
      footer: (info) => console.log(info, 'info')
    }),
    columnHelper.accessor('views', {
      id: 'views',
      header: '浏览量',
      footer: (info) => console.log(info, 'info')
    }),
    columnHelper.accessor('is_top', {
      id: 'is_top',
      header: '是否置顶',
      cell: ({ row }) => {
        return <Tag color={row.original.is_recommend ? 'purple' : 'green'}>{row.original.is_top ? '置顶' : '不置顶'}</Tag>
      },
      footer: (info) => console.log(info, 'info')
    }),
    columnHelper.accessor('is_recommend', {
      id: 'is_recommend',
      header: '是否推荐',
      cell: ({ row }) => {
        return <Tag color={row.original.is_recommend ? 'purple' : 'green'}>{row.original.is_recommend ? '推荐' : '不推荐'}</Tag>
      },
      footer: (info) => console.log(info, 'info')
    }),
    columnHelper.group({
      header: '操作',
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center space-x-2 gap-1">
            {row.original.is_delete ? null : (
              <Button
                variant="destructive"
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
  
  const onChange: PaginationProps['onChange'] = (pageNumber) => {
    console.log('Page: ', pageNumber)
  }
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })
  console.log(table, 'table')
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
