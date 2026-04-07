// components/data-table.tsx
import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import CustomPagination from './pagination'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { KeyboardEvent } from 'react'

interface Column<T> {
    key: keyof T
    title: string
    render?: (value: any, record: T, index: number) => React.ReactNode
}

interface DataTableProps<T> {
    columns: Column<T>[]
    data: T[]
    loading?: boolean
    pagination?: {
        current: number
        total: number
        pageSize: number
        onChange: (page: number) => void
    }
    search?: {
        placeholder?: string
        onSearch: (value: string) => void
    }
    actions?: {
        title?: string
        render: (record: T, index: number) => React.ReactNode
    }
    className?: string
    // 新增：自定义行渲染
    rowRender?: (record: T, index: number) => React.ReactNode
    // 新增：自定义单元格渲染
    cellRender?: (column: Column<T>, value: any, record: T, index: number) => React.ReactNode
    // 新增：行属性
    rowProps?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>
    // 新增：单元格属性
    cellProps?: (column: Column<T>, record: T, index: number) => React.HTMLAttributes<HTMLTableCellElement>
}

export function DataTable<T extends Record<string, any>>({
    columns,
    data,
    loading = false,
    pagination,
    search,
    actions,
    className,
    rowRender,
    cellRender,
    rowProps,
    cellProps
}: DataTableProps<T>) {
    const [searchValue, setSearchValue] = useState("")

    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && search) {
            search.onSearch(searchValue)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        )
    }
    // 默认行渲染函数
    const defaultRowRender = (record: T, index: number) => {
        const rowAttributes = rowProps ? rowProps(record, index) : {}

        return (
            <TableRow key={ index } { ...rowAttributes }>
                { columns.map((column) => {
                    const value = record[column.key]
                    const cellAttributes = cellProps ? cellProps(column, record, index) : {}

                    return (
                        <TableCell key={ String(column.key) } { ...cellAttributes }>
                            { cellRender ? (
                                cellRender(column, value, record, index)
                            ) : column.render ? (
                                column.render(value, record, index)
                            ) : (
                                value
                            ) }
                        </TableCell>
                    )
                }) }
                { actions && (
                    <TableCell>
                        <div className="flex items-center gap-2">
                            { actions.render(record, index) }
                        </div>
                    </TableCell>
                ) }
            </TableRow>
        )
    }

    return (
        <div className={ `${className}` }>
            { search && (
                <div className="flex items-center justify-between px-4 py-2 border">
                    <Input
                        placeholder={ search.placeholder || "搜索..." }
                        value={ searchValue }
                        onChange={ (e) => setSearchValue(e.target.value) }
                        onKeyDown={ handleSearch }
                        className="max-w-sm"
                    />
                </div>
            ) }

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            { columns.map((column) => (
                                <TableHead key={ String(column.key) } className="border border-black-400">
                                    { column.title }
                                </TableHead>
                            )) }
                            { actions && <TableHead className="w-[150px]">{ actions.title || "操作" }</TableHead> }
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { data.map((record, index) =>
                            rowRender ? rowRender(record, index) : defaultRowRender(record, index)
                        ) }
                    </TableBody>
                </Table>
            </div>

            { pagination && (
                <CustomPagination
                    currentPage={ pagination.current }
                    totalPages={ Math.ceil(pagination.total / pagination.pageSize) }
                    onPageChange={ pagination.onChange }
                    className="mt-4"
                />
            ) }
        </div>
    )
}

export default DataTable
