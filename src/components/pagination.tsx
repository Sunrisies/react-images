import React from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    showEllipsis?: boolean
    maxVisiblePages?: number
    className?: string
}

/**
 * 分页组件
 * @param currentPage 当前页码
 * @param totalPages 总页数
 * @param onPageChange 页码变化回调
 * @param showEllipsis 是否显示省略号，默认为true
 * @param maxVisiblePages 最大显示页码数，默认为5
 * @param className 自定义样式类名
 */
export function CustomPagination({
    currentPage,
    totalPages,
    onPageChange,
    showEllipsis = true,
    maxVisiblePages = 5,
    className
}: PaginationProps) {
    // 生成页码数组
    const generatePageNumbers = () => {
        const pages: number[] = []
        const halfVisible = Math.floor(maxVisiblePages / 2)

        let start = Math.max(1, currentPage - halfVisible)
        let end = Math.min(totalPages, start + maxVisiblePages - 1)

        // 调整起始位置，确保显示足够的页码
        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(1, end - maxVisiblePages + 1)
        }

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        return pages
    }

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page)
        }
    }

    const pages = generatePageNumbers()

    return (
        <Pagination className={ className }>
            <PaginationContent>
                {/* 上一页按钮 */ }
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={ (e) => {
                            e.preventDefault()
                            handlePageChange(currentPage - 1)
                        } }
                        className={ currentPage === 1 ? 'pointer-events-none opacity-50' : '' }
                    />
                </PaginationItem>

                {/* 第一页 */ }
                { pages[0] > 1 && (
                    <>
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                onClick={ (e) => {
                                    e.preventDefault()
                                    handlePageChange(1)
                                } }
                            >
                                1
                            </PaginationLink>
                        </PaginationItem>
                        { showEllipsis && pages[0] > 2 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) }
                    </>
                ) }

                {/* 页码列表 */ }
                { pages.map((page) => (
                    <PaginationItem key={ page }>
                        <PaginationLink
                            href="#"
                            isActive={ page === currentPage }
                            onClick={ (e) => {
                                e.preventDefault()
                                handlePageChange(page)
                            } }
                        >
                            { page }
                        </PaginationLink>
                    </PaginationItem>
                )) }

                {/* 最后一页 */ }
                { pages[pages.length - 1] < totalPages && (
                    <>
                        { showEllipsis && pages[pages.length - 1] < totalPages - 1 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) }
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                onClick={ (e) => {
                                    e.preventDefault()
                                    handlePageChange(totalPages)
                                } }
                            >
                                { totalPages }
                            </PaginationLink>
                        </PaginationItem>
                    </>
                ) }

                {/* 下一页按钮 */ }
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={ (e) => {
                            e.preventDefault()
                            handlePageChange(currentPage + 1)
                        } }
                        className={ currentPage === totalPages ? 'pointer-events-none opacity-50' : '' }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default CustomPagination
