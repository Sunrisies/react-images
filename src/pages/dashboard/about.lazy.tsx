import * as React from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Layout } from '@/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const Route = createLazyFileRoute('/dashboard/about')({
  component: AboutComponent,
})

function AboutComponent() {
  return (
    <Layout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">关于系统</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
    </Layout>
  )
}
