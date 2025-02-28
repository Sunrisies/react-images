"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { FileText, Filter, ImageIcon, MoreHorizontal, Search, Trash, Upload, Video } from "lucide-react"
import type { MediaItem } from "@/lib/utils"

interface MediaLibraryProps {
  onClose: () => void
}

export function MediaLibrary({ onClose }: MediaLibraryProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const mediaItems: MediaItem[] = [
    {
      id: "1",
      name: "中国传统建筑.jpg",
      url: "/placeholder.svg?height=200&width=300",
      type: "image",
      size: 1024000,
      createdAt: "2023-05-10",
      uploadedBy: {
        id: "1",
        name: "李明",
        email: "liming@example.com",
        role: "admin",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "2",
      name: "青花瓷设计元素.jpg",
      url: "/placeholder.svg?height=200&width=300",
      type: "image",
      size: 2048000,
      createdAt: "2023-05-08",
      uploadedBy: {
        id: "1",
        name: "李明",
        email: "liming@example.com",
        role: "admin",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "3",
      name: "中国结艺术.jpg",
      url: "/placeholder.svg?height=200&width=300",
      type: "image",
      size: 1536000,
      createdAt: "2023-05-05",
      uploadedBy: {
        id: "2",
        name: "王华",
        email: "wanghua@example.com",
        role: "editor",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "4",
      name: "传统纹样集合.jpg",
      url: "/placeholder.svg?height=200&width=300",
      type: "image",
      size: 3072000,
      createdAt: "2023-05-01",
      uploadedBy: {
        id: "1",
        name: "李明",
        email: "liming@example.com",
        role: "admin",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "5",
      name: "中国传统色彩.jpg",
      url: "/placeholder.svg?height=200&width=300",
      type: "image",
      size: 1843200,
      createdAt: "2023-04-28",
      uploadedBy: {
        id: "3",
        name: "张伟",
        email: "zhangwei@example.com",
        role: "author",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "6",
      name: "设计理念介绍.pdf",
      url: "/placeholder.svg?height=200&width=300",
      type: "document",
      size: 5120000,
      createdAt: "2023-04-25",
      uploadedBy: {
        id: "2",
        name: "王华",
        email: "wanghua@example.com",
        role: "editor",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ]

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>媒体库</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2 py-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="搜索媒体文件..." className="pl-8" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                筛选
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>全部文件</DropdownMenuItem>
              <DropdownMenuItem>图片</DropdownMenuItem>
              <DropdownMenuItem>视频</DropdownMenuItem>
              <DropdownMenuItem>文档</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-primary">
            <Upload className="mr-2 h-4 w-4" />
            上传
          </Button>
        </div>
        <Tabs defaultValue="grid" className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="grid">网格视图</TabsTrigger>
              <TabsTrigger value="list">列表视图</TabsTrigger>
            </TabsList>
            <div className="text-sm text-muted-foreground">{mediaItems.length} 个项目</div>
          </div>
          <div className="mt-2 flex-1 overflow-auto">
            <TabsContent value="grid" className="h-full">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaItems.map((item) => (
                  <Card
                    key={item.id}
                    className={`overflow-hidden ${selectedItems.includes(item.id) ? "ring-2 ring-primary" : ""}`}
                    onClick={() => toggleSelect(item.id)}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-video relative group">
                        {item.type === "image" ? (
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            <img
                              src={item.url || "/placeholder.svg"}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : item.type === "video" ? (
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            <Video className="h-12 w-12 text-muted-foreground" />
                          </div>
                        ) : (
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            <FileText className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="secondary" size="sm">
                            选择
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-2 text-xs flex justify-between items-center">
                      <div className="truncate flex-1">
                        <div className="font-medium truncate">{item.name}</div>
                        <div className="text-muted-foreground">{formatFileSize(item.size)}</div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">更多选项</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>查看详情</DropdownMenuItem>
                          <DropdownMenuItem>下载</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 dark:text-red-400">
                            <Trash className="mr-2 h-4 w-4" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="list" className="h-full">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="h-10 px-4 text-left font-medium">文件名</th>
                      <th className="h-10 px-4 text-left font-medium">类型</th>
                      <th className="h-10 px-4 text-left font-medium">大小</th>
                      <th className="h-10 px-4 text-left font-medium">上传日期</th>
                      <th className="h-10 px-4 text-left font-medium">上传者</th>
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
                            {item.type === "image" ? (
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            ) : item.type === "video" ? (
                              <Video className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="font-medium">{item.name}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          {item.type === "image" ? "图片" : item.type === "video" ? "视频" : "文档"}
                        </td>
                        <td className="p-4 align-middle">{formatFileSize(item.size)}</td>
                        <td className="p-4 align-middle">{item.createdAt}</td>
                        <td className="p-4 align-middle">{item.uploadedBy.name}</td>
                        <td className="p-4 align-middle text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">更多选项</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>查看详情</DropdownMenuItem>
                              <DropdownMenuItem>下载</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                <Trash className="mr-2 h-4 w-4" />
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
          </div>
        </Tabs>
        <DialogFooter className="flex items-center justify-between">
          <div>已选择 {selectedItems.length} 个项目</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button className="bg-primary" onClick={onClose}>
              插入所选项目
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

