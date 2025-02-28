import {createLazyFileRoute} from '@tanstack/react-router'
import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Card, CardContent, CardFooter} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label"
import {ChevronDown, FileText, Filter, ImageIcon, MoreHorizontal, Search, Trash, Upload, Video} from "lucide-react"
import {Layout} from "@/layout"

interface MediaItem {
    id: number
    path: string
    title: string | null
    size: string | null
    type: string | null
    created_at: string
}

export const Route = createLazyFileRoute('/dashboard/media')({
    component: RouteComponent,
})

function RouteComponent() {
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [showUploadDialog, setShowUploadDialog] = useState(false)
    const [showDetailsDialog, setShowDetailsDialog] = useState(false)
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

    const mediaItems: MediaItem[] = [
        {
            id: 1,
            path: "/placeholder.svg?height=200&width=300",
            title: "中国传统建筑.jpg",
            size: "1.2 MB",
            type: "image/jpeg",
            created_at: "2023-05-10T10:30:00Z",
        },
        {
            id: 2,
            path: "/placeholder.svg?height=200&width=300",
            title: "青花瓷设计元素.jpg",
            size: "2.4 MB",
            type: "image/jpeg",
            created_at: "2023-05-08T14:20:00Z",
        },
        {
            id: 3,
            path: "/placeholder.svg?height=200&width=300",
            title: "中国结艺术.jpg",
            size: "1.8 MB",
            type: "image/jpeg",
            created_at: "2023-05-05T09:15:00Z",
        },
        {
            id: 4,
            path: "/placeholder.svg?height=200&width=300",
            title: "传统纹样集合.jpg",
            size: "3.5 MB",
            type: "image/jpeg",
            created_at: "2023-05-01T16:45:00Z",
        },
        {
            id: 5,
            path: "/placeholder.svg?height=200&width=300",
            title: "中国传统色彩.jpg",
            size: "1.9 MB",
            type: "image/jpeg",
            created_at: "2023-04-28T11:30:00Z",
        },
        {
            id: 6,
            path: "/placeholder.svg?height=200&width=300",
            title: "设计理念介绍.pdf",
            size: "5.2 MB",
            type: "application/pdf",
            created_at: "2023-04-25T13:20:00Z",
        },
        {
            id: 7,
            path: "/placeholder.svg?height=200&width=300",
            title: "传统文化视频.mp4",
            size: "15.7 MB",
            type: "video/mp4",
            created_at: "2023-04-20T10:10:00Z",
        },
        {
            id: 8,
            path: "/placeholder.svg?height=200&width=300",
            title: "水墨画技法.jpg",
            size: "2.3 MB",
            type: "image/jpeg",
            created_at: "2023-04-18T09:45:00Z",
        },
    ]

    const toggleSelect = (id: number) => {
        setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
    }

    const showDetails = (media: MediaItem) => {
        setSelectedMedia(media)
        setShowDetailsDialog(true)
    }

    const getMediaIcon = (type: string | null) => {
        if (!type) return <FileText className="h-12 w-12 text-muted-foreground"/>

        if (type.startsWith("image")) {
            return <ImageIcon className="h-12 w-12 text-muted-foreground"/>
        } else if (type.startsWith("video")) {
            return <Video className="h-12 w-12 text-muted-foreground"/>
        } else {
            return <FileText className="h-12 w-12 text-muted-foreground"/>
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <Layout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">媒体库</h2>
                    <Button className="bg-primary" onClick={() => setShowUploadDialog(true)}>
                        <Upload className="mr-2 h-4 w-4"/>
                        上传文件
                    </Button>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input type="search" placeholder="搜索媒体文件..." className="w-full pl-8"/>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9">
                                    <Filter className="mr-2 h-4 w-4"/>
                                    筛选
                                    <ChevronDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>全部文件</DropdownMenuItem>
                                <DropdownMenuItem>图片</DropdownMenuItem>
                                <DropdownMenuItem>视频</DropdownMenuItem>
                                <DropdownMenuItem>文档</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>共 {mediaItems.length} 个文件</span>
                        {selectedItems.length > 0 && <span className="ml-2">已选择 {selectedItems.length} 个文件</span>}
                    </div>
                </div>

                <Tabs defaultValue="grid" className="w-full">
                    <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="grid">网格视图</TabsTrigger>
                            <TabsTrigger value="list">列表视图</TabsTrigger>
                        </TabsList>
                        {selectedItems.length > 0 && (
                            <Button variant="destructive" size="sm">
                                <Trash className="mr-2 h-4 w-4"/>
                                删除所选
                            </Button>
                        )}
                    </div>

                    <TabsContent value="grid" className="mt-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {mediaItems.map((item) => (
                                <Card
                                    key={item.id}
                                    className={`overflow-hidden cursor-pointer ${selectedItems.includes(item.id) ? "ring-2 ring-primary" : ""}`}
                                    onClick={() => toggleSelect(item.id)}
                                >
                                    <CardContent className="p-0">
                                        <div className="aspect-video relative group">
                                            {item.type?.startsWith("image") ? (
                                                <div
                                                    className="h-full w-full bg-muted flex items-center justify-center">
                                                    <img
                                                        src={item.path || "/placeholder.svg"}
                                                        alt={item.title || "媒体文件"}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    className="h-full w-full bg-muted flex items-center justify-center">
                                                    {getMediaIcon(item.type)}
                                                </div>
                                            )}
                                            <div
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        showDetails(item)
                                                    }}
                                                >
                                                    查看详情
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-2 text-xs flex justify-between items-center">
                                        <div className="truncate flex-1">
                                            <div className="font-medium truncate">{item.title}</div>
                                            <div className="text-muted-foreground">{item.size}</div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7"
                                                        onClick={(e) => e.stopPropagation()}>
                                                    <MoreHorizontal className="h-4 w-4"/>
                                                    <span className="sr-only">更多选项</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        showDetails(item)
                                                    }}
                                                >
                                                    查看详情
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>下载</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                                    <Trash className="mr-2 h-4 w-4"/>
                                                    删除
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="list" className="mt-4">
                        <div className="rounded-md border">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b">
                                    <th className="h-10 px-4 text-left font-medium">文件名</th>
                                    <th className="h-10 px-4 text-left font-medium">类型</th>
                                    <th className="h-10 px-4 text-left font-medium">大小</th>
                                    <th className="h-10 px-4 text-left font-medium">上传日期</th>
                                    <th className="h-10 px-4 text-right font-medium">操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                {mediaItems.map((item) => (
                                    <tr
                                        key={item.id}
                                        className={`border-b hover:bg-muted/50 ${selectedItems.includes(item.id) ? "bg-primary/10" : ""}`}
                                        onClick={() => toggleSelect(item.id)}
                                    >
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                {item.type?.startsWith("image") ? (
                                                    <ImageIcon className="h-4 w-4 text-muted-foreground"/>
                                                ) : item.type?.startsWith("video") ? (
                                                    <Video className="h-4 w-4 text-muted-foreground"/>
                                                ) : (
                                                    <FileText className="h-4 w-4 text-muted-foreground"/>
                                                )}
                                                <span className="font-medium">{item.title}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">{item.type || "未知"}</td>
                                        <td className="p-4 align-middle">{item.size}</td>
                                        <td className="p-4 align-middle">{formatDate(item.created_at)}</td>
                                        <td className="p-4 align-middle text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8"
                                                            onClick={(e) => e.stopPropagation()}>
                                                        <MoreHorizontal className="h-4 w-4"/>
                                                        <span className="sr-only">更多选项</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            showDetails(item)
                                                        }}
                                                    >
                                                        查看详情
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>下载</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                                        <Trash className="mr-2 h-4 w-4"/>
                                                        删除
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* 上传文件对话框 */}
                <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>上传文件</DialogTitle>
                            <DialogDescription>选择要上传到媒体库的文件</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div
                                className="border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center">
                                <div className="rounded-full bg-primary/10 p-3 mb-4">
                                    <Upload className="h-6 w-6 text-primary"/>
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-sm font-medium">拖放文件到此处或点击上传</p>
                                    <p className="text-xs text-muted-foreground">支持 JPG, PNG, GIF, PDF, MP4 等格式，单个文件最大
                                        20MB</p>
                                    <Button size="sm" className="mt-2">
                                        选择文件
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">文件标题</Label>
                                <Input id="title" placeholder="输入文件标题（可选）"/>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                                取消
                            </Button>
                            <Button className="bg-primary">上传</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* 文件详情对话框 */}
                {selectedMedia && (
                    <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>文件详情</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div
                                    className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                                    {selectedMedia.type?.startsWith("image") ? (
                                        <img
                                            src={selectedMedia.path || "/placeholder.svg"}
                                            alt={selectedMedia.title || "媒体文件"}
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            {getMediaIcon(selectedMedia.type)}
                                            <span className="mt-2 text-sm font-medium">{selectedMedia.title}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium">文件名</p>
                                        <p className="text-sm text-muted-foreground">{selectedMedia.title}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">类型</p>
                                        <p className="text-sm text-muted-foreground">{selectedMedia.type || "未知"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">大小</p>
                                        <p className="text-sm text-muted-foreground">{selectedMedia.size}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">上传日期</p>
                                        <p className="text-sm text-muted-foreground">{formatDate(selectedMedia.created_at)}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm font-medium">路径</p>
                                        <p className="text-sm text-muted-foreground truncate">{selectedMedia.path}</p>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                                    关闭
                                </Button>
                                <Button variant="destructive">
                                    <Trash className="mr-2 h-4 w-4"/>
                                    删除
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

        </Layout>
    )
}
