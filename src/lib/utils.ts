import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface Comment {
    id: string
    postId: string
    author: {
        name: string
        email: string
        avatar?: string
    }
    content: string
    status: "pending" | "approved" | "spam"
    createdAt: string
}
