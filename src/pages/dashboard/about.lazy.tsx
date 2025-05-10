import * as React from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Layout } from '@/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCommitHistory } from '@/services/github';
import { getRelativeTime } from 'sunrise-utils'
export const Route = createLazyFileRoute('/dashboard/about')({
  component: AboutComponent,
})

function AboutComponent() {
  const { data: commits, isLoading, error } = useCommitHistory();
  console.log(commits, 'commits')
  if (isLoading) return <div className="flex items-center justify-center h-full">加载中...</div>;
  if (error) return <div className="text-red-500">加载失败: {error.message}</div>;
  return (
    <Layout>
      <div className="flex h-full gap-6 p-6">
        {/* 左侧固定的系统信息部分 */}
        <div className="fixed w-1/3 p-6 pr-3 h-full overflow-y-auto">
          <h2 className="text-3xl font-bold tracking-tight">关于系统</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>系统简介</CardTitle>
                <CardDescription>博客管理系统介绍</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  这是一个现代化的博客管理系统，采用最新的技术栈开发，提供了文章管理、用户管理、媒体管理等功能。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>技术栈</CardTitle>
                <CardDescription>使用的主要技术</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                  <li>React + TypeScript</li>
                  <li>TanStack Router</li>
                  <li>Tailwind CSS</li>
                  <li>Shadcn UI</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>版本信息</CardTitle>
                <CardDescription>当前系统版本</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>版本号：1.0.0</p>
                  <p>更新日期：2024年</p>
                  <p>开发团队：博客开发团队</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 右侧可滚动的提交历史部分 */}
        <div className="ml-[40%] flex-1 p-6 pl-3">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>提交历史</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="relative">
                {/* 时间轴中间线 */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

                <div className="space-y-8">
                  {commits?.map((commit) => (
                    <div key={commit.sha} className="relative flex items-start">
                      {/* 时间轴圆点 */}
                      <div className="absolute left-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-white z-10">
                        {commit.commit.author.name.charAt(0)}
                      </div>

                      {/* 提交内容卡片 */}
                      <div className="ml-16 flex-1 bg-card rounded-lg border p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">{commit.commit.author.name}</p>
                          <time className="text-xs text-muted-foreground">
                            {getRelativeTime(new Date(commit.commit.author.date))}
                          </time>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{commit.commit.message}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            {commit.sha.substring(0, 7)}
                          </span>
                          <a
                            href={commit.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            查看详情
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
