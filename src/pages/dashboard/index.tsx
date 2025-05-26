import { Layout } from '@/layout'
import { isLogin } from '@/utils/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, DateCountChart, LineChart } from "@/components/charts"
import { RecentPosts } from "@/components/recent-posts"
import { RecentComments } from "@/components/recent-comments"
import { BarChart3, FileText, MessageSquare, Users } from "lucide-react"
// import "@/styles/globals.scss"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import {useGetUploadTime} from '@/services/index'
export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
  beforeLoad: () => {
    // 判断是否登录
    // if (!isLogin()) {
    //   return redirect({ to: '/auth/login' })
    // }
  },
})

function RouteComponent() {
  const {data,isLoading,isError,error} = useGetUploadTime()
  if (isLoading) return <div className="flex items-center justify-center h-full">加载中...</div>;
  if (isError) return <div className="text-red-500">加载失败: {error.message}</div>;
  return (<Layout>
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">仪表盘</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">欢迎回来，管理员</span>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="analytics">分析</TabsTrigger>
          <TabsTrigger value="reports">报告</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总文章数</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <p className="text-xs text-muted-foreground">较上月 +12%</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-accent">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总浏览量</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45,231</div>
                <p className="text-xs text-muted-foreground">较上月 +18.2%</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">评论数</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-muted-foreground">较上月 +8.4%</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,845</div>
                <p className="text-xs text-muted-foreground">较上月 +10.1%</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>流量趋势</CardTitle>
                <CardDescription>过去30天的网站访问量</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <LineChart />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>内容分类</CardTitle>
                <CardDescription>按类别划分的内容分布</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>日期分布统计</CardTitle>
                <CardDescription>按日期统计的数据分布</CardDescription>
              </CardHeader>
              <CardContent>
                <DateCountChart data={data} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>最新评论</CardTitle>
                <CardDescription>需要审核的最新评论</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentComments />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>详细分析</CardTitle>
              <CardDescription>查看更详细的网站分析数据</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <LineChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>报告生成</CardTitle>
              <CardDescription>生成自定义报告</CardDescription>
            </CardHeader>
            <CardContent>
              <p>报告功能正在开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </Layout>
  )
}
