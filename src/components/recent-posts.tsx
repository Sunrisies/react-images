import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Eye } from "lucide-react"

export function RecentPosts() {
  const posts = [
    {
      id: "1",
      title: "中国传统文化在现代设计中的应用",
      status: "published",
      publishedAt: "2023-05-15",
      author: {
        name: "李明",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      views: 1245,
    },
    {
      id: "2",
      title: "数字化转型：企业面临的挑战与机遇",
      status: "draft",
      publishedAt: null,
      author: {
        name: "王华",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      views: 0,
    },
    {
      id: "3",
      title: "可持续发展：绿色科技的未来",
      status: "scheduled",
      publishedAt: "2023-06-01",
      author: {
        name: "张伟",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      views: 0,
    },
    {
      id: "4",
      title: "人工智能在医疗领域的应用前景",
      status: "published",
      publishedAt: "2023-05-10",
      author: {
        name: "刘芳",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      views: 876,
    },
  ]

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="flex items-center justify-between border-b pb-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{post.title}</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{post.author.name}</span>
                <span>•</span>
                {post.status === "published" ? (
                  <span>{post.publishedAt}</span>
                ) : post.status === "scheduled" ? (
                  <span>计划于 {post.publishedAt}</span>
                ) : (
                  <span>草稿</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.status === "published" ? (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400"
              >
                已发布
              </Badge>
            ) : post.status === "scheduled" ? (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
              >
                已计划
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 hover:bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400"
              >
                草稿
              </Badge>
            )}
            <div className="flex items-center gap-1">
              {post.status === "published" && (
                <>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{post.views}</span>
                </>
              )}
            </div>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
              <span className="sr-only">编辑</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

