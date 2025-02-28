import {createLazyFileRoute} from '@tanstack/react-router'
import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Switch} from "@/components/ui/switch"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Separator} from "@/components/ui/separator"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Save} from "lucide-react"
import {Layout} from "@/layout"

export const Route = createLazyFileRoute('/dashboard/settings')({
    component: RouteComponent,
})

function RouteComponent() {
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = () => {
        setIsSaving(true)
        // 模拟保存请求
        setTimeout(() => {
            setIsSaving(false)
        }, 1500)
    }

    return (<Layout>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">系统设置</h2>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">基本设置</TabsTrigger>
                    <TabsTrigger value="appearance">外观设置</TabsTrigger>
                    <TabsTrigger value="seo">SEO设置</TabsTrigger>
                    <TabsTrigger value="security">安全设置</TabsTrigger>
                    <TabsTrigger value="backup">备份与恢复</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>网站信息</CardTitle>
                            <CardDescription>设置您的网站基本信息</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="site-name">网站名称</Label>
                                    <Input id="site-name" defaultValue="我的博客"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="site-url">网站地址</Label>
                                    <Input id="site-url" defaultValue="https://example.com"/>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="site-description">网站描述</Label>
                                <Textarea
                                    id="site-description"
                                    className="min-h-[100px]"
                                    defaultValue="这是一个关于科技、设计和文化的博客，分享有价值的内容。"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="site-logo">网站Logo</Label>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Logo"/>
                                        <AvatarFallback>博</AvatarFallback>
                                    </Avatar>
                                    <Button variant="outline">上传Logo</Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="site-favicon">网站图标</Label>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Favicon"/>
                                        <AvatarFallback>博</AvatarFallback>
                                    </Avatar>
                                    <Button variant="outline">上传图标</Button>
                                </div>
                                <p className="text-xs text-muted-foreground">推荐尺寸: 32x32 像素</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="bg-primary" onClick={handleSave} disabled={isSaving}>
                                <Save className="mr-2 h-4 w-4"/>
                                {isSaving ? "保存中..." : "保存设置"}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>联系信息</CardTitle>
                            <CardDescription>设置您的联系方式</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="admin-email">管理员邮箱</Label>
                                    <Input id="admin-email" type="email" defaultValue="admin@example.com"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact-phone">联系电话</Label>
                                    <Input id="contact-phone" defaultValue="13800138000"/>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact-address">联系地址</Label>
                                <Textarea id="contact-address" defaultValue="北京市朝阳区xxx街道xxx号"/>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="bg-primary" onClick={handleSave} disabled={isSaving}>
                                <Save className="mr-2 h-4 w-4"/>
                                {isSaving ? "保存中..." : "保存设置"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>主题设置</CardTitle>
                            <CardDescription>自定义您的网站外观</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>主题模式</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" id="theme-light" name="theme" className="h-4 w-4"
                                               defaultChecked/>
                                        <Label htmlFor="theme-light">亮色</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" id="theme-dark" name="theme" className="h-4 w-4"/>
                                        <Label htmlFor="theme-dark">暗色</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" id="theme-auto" name="theme" className="h-4 w-4"/>
                                        <Label htmlFor="theme-auto">跟随系统</Label>
                                    </div>
                                </div>
                            </div>

                            <Separator/>

                            <div className="space-y-2">
                                <Label>主色调</Label>
                                <div className="grid grid-cols-5 gap-2">
                                    <div className="flex flex-col items-center gap-1">
                                        <div
                                            className="h-10 w-10 rounded-full bg-red-600 cursor-pointer ring-2 ring-offset-2 ring-red-600"></div>
                                        <span className="text-xs">红色</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="h-10 w-10 rounded-full bg-blue-600 cursor-pointer"></div>
                                        <span className="text-xs">蓝色</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="h-10 w-10 rounded-full bg-green-600 cursor-pointer"></div>
                                        <span className="text-xs">绿色</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="h-10 w-10 rounded-full bg-purple-600 cursor-pointer"></div>
                                        <span className="text-xs">紫色</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="h-10 w-10 rounded-full bg-amber-600 cursor-pointer"></div>
                                        <span className="text-xs">琥珀色</span>
                                    </div>
                                </div>
                            </div>

                            <Separator/>

                            <div className="space-y-2">
                                <Label>字体设置</Label>
                                <Select defaultValue="default">
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择字体"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">默认字体</SelectItem>
                                        <SelectItem value="serif">衬线字体</SelectItem>
                                        <SelectItem value="sans">无衬线字体</SelectItem>
                                        <SelectItem value="mono">等宽字体</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>布局设置</Label>
                                <Select defaultValue="sidebar">
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择布局"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sidebar">侧边栏布局</SelectItem>
                                        <SelectItem value="topbar">顶部导航布局</SelectItem>
                                        <SelectItem value="minimal">极简布局</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="bg-primary" onClick={handleSave} disabled={isSaving}>
                                <Save className="mr-2 h-4 w-4"/>
                                {isSaving ? "保存中..." : "保存设置"}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>首页设置</CardTitle>
                            <CardDescription>自定义您的网站首页</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>首页显示</Label>
                                <div className="flex items-center space-x-2">
                                    <input type="radio" id="home-latest" name="home-display" className="h-4 w-4"
                                           defaultChecked/>
                                    <Label htmlFor="home-latest">最新文章</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="radio" id="home-static" name="home-display" className="h-4 w-4"/>
                                    <Label htmlFor="home-static">静态页面</Label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="posts-per-page">每页显示文章数</Label>
                                <Input id="posts-per-page" type="number" defaultValue="10" min="1" max="50"/>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch id="show-featured" defaultChecked/>
                                <Label htmlFor="show-featured">显示特色文章轮播</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch id="show-categories" defaultChecked/>
                                <Label htmlFor="show-categories">显示分类导航</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch id="show-sidebar" defaultChecked/>
                                <Label htmlFor="show-sidebar">显示侧边栏</Label>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="bg-primary" onClick={handleSave} disabled={isSaving}>
                                <Save className="mr-2 h-4 w-4"/>
                                {isSaving ? "保存中..." : "保存设置"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO设置</CardTitle>
                            <CardDescription>优化您的网站以提高搜索引擎排名</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="meta-title">默认Meta标题</Label>
                                <Input id="meta-title" defaultValue="我的博客 - 分享科技、设计和文化"/>
                                <p className="text-xs text-muted-foreground">建议长度: 50-60个字符</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="meta-description">默认Meta描述</Label>
                                <Textarea
                                    id="meta-description"
                                    className="min-h-[100px]"
                                    defaultValue="这是一个关于科技、设计和文化的博客，分享有价值的内容，帮助读者了解最新的行业动态和知识。"
                                />
                                <p className="text-xs text-muted-foreground">建议长度: 150-160个字符</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="meta-keywords">默认Meta关键词</Label>
                                <Input id="meta-keywords" defaultValue="博客,科技,设计,文化,创新"/>
                                <p className="text-xs text-muted-foreground">使用逗号分隔关键词</p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch id="enable-sitemap" defaultChecked/>
                                <Label htmlFor="enable-sitemap">启用自动生成站点地图</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch id="enable-robots" defaultChecked/>
                                <Label htmlFor="enable-robots">启用robots.txt</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch id="enable-canonical" defaultChecked/>
                                <Label htmlFor="enable-canonical">启用规范链接</Label>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="google-analytics">Google Analytics ID</Label>
                                <Input id="google-analytics" placeholder="UA-XXXXXXXXX-X 或 G-XXXXXXXXXX"/>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="baidu-analytics">百度统计ID</Label>
                                <Input id="baidu-analytics" placeholder="输入百度统计ID"/>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="bg-primary" onClick={handleSave} disabled={isSaving}>
                                <Save className="mr-2 h-4 w-4"/>
                                {isSaving ? "保存中..." : "保存设置"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>安全设置</CardTitle>
                            <CardDescription>保护您的网站安全</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>登录保护</Label>
                                <div className="flex items-center space-x-2">
                                    <Switch id="enable-2fa"/>
                                    <Label htmlFor="enable-2fa">启用两步验证</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="login-captcha" defaultChecked/>
                                    <Label htmlFor="login-captcha">启用登录验证码</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="login-limit" defaultChecked/>
                                    <Label htmlFor="login-limit">启用登录失败限制</Label>
                                </div>
                            </div>

                            <Separator/>

                            <div className="space-y-2">
                                <Label>内容安全</Label>
                                <div className="flex items-center space-x-2">
                                    <Switch id="comment-moderation" defaultChecked/>
                                    <Label htmlFor="comment-moderation">启用评论审核</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="comment-captcha" defaultChecked/>
                                    <Label htmlFor="comment-captcha">启用评论验证码</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="content-filter" defaultChecked/>
                                    <Label htmlFor="content-filter">启用内容过滤</Label>
                                </div>
                            </div>

                            <Separator/>

                            <div className="space-y-2">
                                <Label>数据保护</Label>
                                <div className="flex items-center space-x-2">
                                    <Switch id="auto-backup" defaultChecked/>
                                    <Label htmlFor="auto-backup">启用自动备份</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="ssl-force" defaultChecked/>
                                    <Label htmlFor="ssl-force">强制使用HTTPS</Label>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="bg-primary" onClick={handleSave} disabled={isSaving}>
                                <Save className="mr-2 h-4 w-4"/>
                                {isSaving ? "保存中..." : "保存设置"}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>密码修改</CardTitle>
                            <CardDescription>修改您的管理员密码</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">当前密码</Label>
                                <Input id="current-password" type="password"/>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="new-password">新密码</Label>
                                <Input id="new-password" type="password"/>
                                <p className="text-xs text-muted-foreground">密码长度至少8位，包含大小写字母、数字和特殊字符</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">确认新密码</Label>
                                <Input id="confirm-password" type="password"/>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="bg-primary" onClick={handleSave} disabled={isSaving}>
                                <Save className="mr-2 h-4 w-4"/>
                                {isSaving ? "保存中..." : "更新密码"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="backup" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>备份设置</CardTitle>
                            <CardDescription>管理您的网站备份</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>自动备份</Label>
                                <div className="flex items-center space-x-2">
                                    <Switch id="enable-auto-backup" defaultChecked/>
                                    <Label htmlFor="enable-auto-backup">启用自动备份</Label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="backup-frequency">备份频率</Label>
                                <Select defaultValue="weekly">
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择备份频率"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">每天</SelectItem>
                                        <SelectItem value="weekly">每周</SelectItem>
                                        <SelectItem value="monthly">每月</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="backup-retention">保留备份数量</Label>
                                <Input id="backup-retention" type="number" defaultValue="5" min="1" max="30"/>
                                <p className="text-xs text-muted-foreground">
                                    系统将保留最近的备份数量，超过此数量的旧备份将被自动删除
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>备份内容</Label>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="backup-database" className="h-4 w-4" defaultChecked/>
                                    <Label htmlFor="backup-database">数据库</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="backup-files" className="h-4 w-4" defaultChecked/>
                                    <Label htmlFor="backup-files">文件</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="backup-settings" className="h-4 w-4" defaultChecked/>
                                    <Label htmlFor="backup-settings">系统设置</Label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>手动备份</Label>
                                <Button variant="outline" className="w-full">
                                    立即创建备份
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="bg-primary" onClick={handleSave} disabled={isSaving}>
                                <Save className="mr-2 h-4 w-4"/>
                                {isSaving ? "保存中..." : "保存设置"}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>备份历史</CardTitle>
                            <CardDescription>查看和管理您的备份历史</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full">
                                    <thead>
                                    <tr className="border-b">
                                        <th className="h-10 px-4 text-left font-medium">备份日期</th>
                                        <th className="h-10 px-4 text-left font-medium">类型</th>
                                        <th className="h-10 px-4 text-left font-medium">大小</th>
                                        <th className="h-10 px-4 text-right font-medium">操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr className="border-b">
                                        <td className="p-4 align-middle">2023-05-15 10:30</td>
                                        <td className="p-4 align-middle">自动</td>
                                        <td className="p-4 align-middle">25.4 MB</td>
                                        <td className="p-4 align-middle text-right">
                                            <Button variant="ghost" size="sm">
                                                下载
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                恢复
                                            </Button>
                                            <Button variant="ghost" size="sm"
                                                    className="text-red-600 dark:text-red-400">
                                                删除
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-4 align-middle">2023-05-08 10:30</td>
                                        <td className="p-4 align-middle">自动</td>
                                        <td className="p-4 align-middle">24.8 MB</td>
                                        <td className="p-4 align-middle text-right">
                                            <Button variant="ghost" size="sm">
                                                下载
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                恢复
                                            </Button>
                                            <Button variant="ghost" size="sm"
                                                    className="text-red-600 dark:text-red-400">
                                                删除
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-4 align-middle">2023-05-01 15:45</td>
                                        <td className="p-4 align-middle">手动</td>
                                        <td className="p-4 align-middle">26.2 MB</td>
                                        <td className="p-4 align-middle text-right">
                                            <Button variant="ghost" size="sm">
                                                下载
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                恢复
                                            </Button>
                                            <Button variant="ghost" size="sm"
                                                    className="text-red-600 dark:text-red-400">
                                                删除
                                            </Button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    </Layout>)
}
