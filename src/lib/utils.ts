import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export type Role = "admin" | "editor" | "author"

export interface User {
    id: string
    name: string
    email: string
    role: Role
    avatar: string
}

export interface Post {
    id: string
    title: string
    excerpt: string
    content: string
    author: User
    status: "draft" | "published" | "scheduled"
    publishedAt: string
    createdAt: string
    updatedAt: string
    featuredImage?: string
    tags: string[]
    views: number
    comments: number
}

// export interface Comment {
//     id: string
//     postId: string
//     author: {
//         name: string
//         email: string
//         avatar?: string
//     }
//     content: string
//     status: "pending" | "approved" | "spam"
//     createdAt: string
// }
export interface Comment {
    id: number
    content: string
    nickname: string
    email: string
    created_at: string
    article: {
        title: string
    }
    parentId?: number
    isDeleted: boolean
    children?: Comment[]
}

export interface MediaItem {
    id: string
    name: string
    url: string
    type: "image" | "video" | "document"
    size: number
    createdAt: string
    uploadedBy: User
}

export interface AnalyticsData {
    pageViews: number
    uniqueVisitors: number
    averageTimeOnPage: number
    bounceRate: number
    topPosts: {
        id: string
        title: string
        views: number
    }[]
    dailyViews: {
        date: string
        views: number
    }[]
}
