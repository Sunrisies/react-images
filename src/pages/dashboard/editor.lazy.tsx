import {createLazyFileRoute} from '@tanstack/react-router'
import {Layout} from "@/layout";
import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {RichTextEditor} from "@/components/rich-text-editor"
import {Calendar, Clock, ImageIcon, Save, Tag, Upload} from "lucide-react"
import {Badge} from "@/components/ui/badge"
import {MediaLibrary} from "@/components/media-library"

export const Route = createLazyFileRoute('/dashboard/editor')({
    component: RouteComponent,
})

function RouteComponent() {
    const [content, setContent] = useState("")
    const [showMediaLibrary, setShowMediaLibrary] = useState(false)

    return (
        <Layout>
            <div className="flex-1 p-4 md:p-8 pt-6">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">编辑文章</h2>
                        <div className="flex items-center gap-2">
                            <Button variant="outline">预览</Button>
                            <Button className="bg-primary">
                                <Save className="mr-2 h-4 w-4"/>
                                保存
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">标题</Label>
                                <Input id="title" placeholder="输入文章标题"
                                       defaultValue="中国传统文化在现代设计中的应用"/>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">摘要</Label>
                                <Textarea
                                    id="excerpt"
                                    placeholder="输入文章摘要"
                                    className="min-h-[100px]"
                                    defaultValue="本文探讨了中国传统文化元素如何在现代设计中得到创新应用，以及如何在保持传统精髓的同时赋予其现代感。"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>内容</Label>
                                    <Button variant="outline" size="sm" onClick={() => setShowMediaLibrary(true)}>
                                        <ImageIcon className="mr-2 h-4 w-4"/>
                                        插入媒体
                                    </Button>
                                </div>
                                <RichTextEditor value={content} onChange={setContent}/>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>发布设置</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="status">状态</Label>
                                        <Select defaultValue="published">
                                            <SelectTrigger>
                                                <SelectValue placeholder="选择状态"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="published">已发布</SelectItem>
                                                <SelectItem value="draft">草稿</SelectItem>
                                                <SelectItem value="scheduled">计划发布</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>发布日期</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="relative">
                                                <Calendar
                                                    className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                                                <Input type="date" className="pl-8" defaultValue="2023-05-15"/>
                                            </div>
                                            <div className="relative">
                                                <Clock
                                                    className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                                                <Input type="time" className="pl-8" defaultValue="09:00"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="author">作者</Label>
                                        <Select defaultValue="1">
                                            <SelectTrigger>
                                                <SelectValue placeholder="选择作者"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">李明</SelectItem>
                                                <SelectItem value="2">王华</SelectItem>
                                                <SelectItem value="3">张伟</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category">分类</Label>
                                        <Select defaultValue="1">
                                            <SelectTrigger>
                                                <SelectValue placeholder="选择分类"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">设计</SelectItem>
                                                <SelectItem value="2">文化</SelectItem>
                                                <SelectItem value="3">艺术</SelectItem>
                                                <SelectItem value="4">科技</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>标签</Label>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline" className="flex items-center gap-1">
                                                中国文化
                                                <button className="ml-1 rounded-full hover:bg-muted">
                                                    <span className="sr-only">移除</span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M18 6 6 18"/>
                                                        <path d="m6 6 12 12"/>
                                                    </svg>
                                                </button>
                                            </Badge>
                                            <Badge variant="outline" className="flex items-center gap-1">
                                                设计
                                                <button className="ml-1 rounded-full hover:bg-muted">
                                                    <span className="sr-only">移除</span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M18 6 6 18"/>
                                                        <path d="m6 6 12 12"/>
                                                    </svg>
                                                </button>
                                            </Badge>
                                            <Badge variant="outline" className="flex items-center gap-1">
                                                传统
                                                <button className="ml-1 rounded-full hover:bg-muted">
                                                    <span className="sr-only">移除</span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M18 6 6 18"/>
                                                        <path d="m6 6 12 12"/>
                                                    </svg>
                                                </button>
                                            </Badge>
                                            <Button variant="outline" size="sm" className="h-7 gap-1">
                                                <Tag className="h-3.5 w-3.5"/>
                                                <span>添加</span>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>特色图片</CardTitle>
                                    <CardDescription>设置文章的特色图片</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div
                                        className="aspect-video overflow-hidden rounded-md border border-dashed border-muted flex items-center justify-center">
                                        <div
                                            className="flex flex-col items-center justify-center space-y-2 p-8 text-center">
                                            <div className="rounded-full bg-primary/10 p-3">
                                                <Upload className="h-6 w-6 text-primary"/>
                                            </div>
                                            <div className="text-sm font-medium">拖放图片或点击上传</div>
                                            <div className="text-xs text-muted-foreground">推荐尺寸: 1200 x 630 像素
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {showMediaLibrary && <MediaLibrary onClose={() => setShowMediaLibrary(false)}/>}
            </div>
        </Layout>
    )
}
