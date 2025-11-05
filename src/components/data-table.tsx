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
    render?: (value: any, record: T) => React.ReactNode
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
        render: (record: T) => React.ReactNode
    }
    className?: string
}

export function DataTable<T extends Record<string, any>>({
    columns,
    data,
    loading = false,
    pagination,
    search,
    actions,
    className
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

    return (
        <div className={ `${className}` }>
            { search && (
                <div className="flex items-center justify-between p-4 border">
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
                                <TableHead key={ String(column.key) }>
                                    { column.title }
                                </TableHead>
                            )) }
                            { actions && <TableHead className="w-[150px]">{ actions.title || "操作" }</TableHead> }
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { data.map((record, index) => (
                            <TableRow key={ index }>
                                { columns.map((column) => (
                                    <TableCell key={ String(column.key) }>
                                        { column.render
                                            ? column.render(record[column.key], record)
                                            : record[column.key] }
                                    </TableCell>
                                )) }
                                { actions && (
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            { actions.render(record) }
                                        </div>
                                    </TableCell>
                                ) }
                            </TableRow>
                        )) }
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
