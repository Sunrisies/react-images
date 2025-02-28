import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

export function RecentComments() {
  const comments = [
    {
      id: "1",
      author: {
        name: "陈小明",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      content: "这篇文章写得非常好，对我帮助很大！",
      postTitle: "中国传统文化在现代设计中的应用",
      createdAt: "10分钟前",
    },
    {
      id: "2",
      author: {
        name: "李华",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      content: "我对这个话题很感兴趣，希望能看到更多相关内容。",
      postTitle: "人工智能在医疗领域的应用前景",
      createdAt: "30分钟前",
    },
    {
      id: "3",
      author: {
        name: "王芳",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      content: "文章中提到的观点很有启发性，但我有不同的看法...",
      postTitle: "数字化转型：企业面临的挑战与机遇",
      createdAt: "1小时前",
    },
  ]

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-3 border-b pb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
            <AvatarFallback>{comment.author.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{comment.author.name}</p>
              <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
            </div>
            <p className="text-sm">{comment.content}</p>
            <p className="text-xs text-muted-foreground">在《{comment.postTitle}》</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-600 hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/20"
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">批准</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/20"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">拒绝</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

