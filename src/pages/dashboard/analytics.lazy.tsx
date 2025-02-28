import {createLazyFileRoute} from '@tanstack/react-router'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {format} from "date-fns"
import {zhCN} from "date-fns/locale"
import {CalendarIcon, Download} from "lucide-react"
import {useState} from "react"
import {Bar, Line, Pie} from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    type ChartOptions,
} from "chart.js"
import {Layout} from "@/layout";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)
export const Route = createLazyFileRoute('/dashboard/analytics')({
    component: RouteComponent,
})

function RouteComponent() {
    const [date, setDate] = useState<Date | undefined>(new Date())

    // 访问量数据
    const visitData = {
        labels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"].slice(0, 30),
        datasets: [
            {
                label: "访问量",
                data: Array.from({length: 30}, () => Math.floor(Math.random() * 1000) + 500),
                borderColor: "hsl(var(--primary))",
                backgroundColor: "hsl(var(--primary) / 0.1)",
                tension: 0.3,
                fill: true,
            },
        ],
    }

    // 文章分类数据
    const categoryData = {
        labels: ["科技", "生活", "旅行", "美食", "教育", "健康"],
        datasets: [
            {
                label: "文章数量",
                data: [25, 20, 15, 18, 12, 10],
                backgroundColor: [
                    "hsl(var(--primary) / 0.8)",
                    "hsl(var(--accent) / 0.8)",
                    "hsl(215 100% 50% / 0.8)",
                    "hsl(142 76% 36% / 0.8)",
                    "hsl(262 83% 58% / 0.8)",
                    "hsl(24 100% 50% / 0.8)",
                ],
            },
        ],
    }

    // 设备分布数据
    const deviceData = {
        labels: ["桌面端", "移动端", "平板", "其他"],
        datasets: [
            {
                label: "访问设备",
                data: [55, 35, 8, 2],
                backgroundColor: [
                    "hsl(215 100% 50% / 0.8)",
                    "hsl(var(--primary) / 0.8)",
                    "hsl(var(--accent) / 0.8)",
                    "hsl(262 83% 58% / 0.8)",
                ],
                borderColor: ["hsl(215 100% 50%)", "hsl(var(--primary))", "hsl(var(--accent))", "hsl(262 83% 58%)"],
                borderWidth: 1,
            },
        ],
    }

    // 热门文章数据
    const popularPosts = [
        {id: 1, title: "中国传统文化在现代设计中的应用", views: 1245, comments: 32},
        {id: 2, title: "5G技术如何改变我们的生活", views: 1532, comments: 45},
        {id: 3, title: "中国古代建筑的美学特点", views: 2145, comments: 67},
        {id: 4, title: "人工智能在医疗领域的应用前景", views: 876, comments: 15},
        {id: 5, title: "数字化转型：企业面临的挑战与机遇", views: 743, comments: 23},
    ]

    // IP地址访问数据
    const ipData = [
        {ip: "114.88.xx.xx", location: "北京", visits: 245, lastVisit: "2023-05-15 10:30"},
        {ip: "202.96.xx.xx", location: "上海", visits: 189, lastVisit: "2023-05-15 09:45"},
        {ip: "119.145.xx.xx", location: "广州", visits: 156, lastVisit: "2023-05-14 16:20"},
        {ip: "61.135.xx.xx", location: "北京", visits: 132, lastVisit: "2023-05-14 14:15"},
        {ip: "123.125.xx.xx", location: "天津", visits: 98, lastVisit: "2023-05-13 20:30"},
    ]

    const chartOptions: ChartOptions<"line"> = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        maintainAspectRatio: false,
    }

    const pieOptions: ChartOptions<"pie"> = {
        responsive: true,
        plugins: {
            legend: {
                position: "right" as const,
            },
        },
        maintainAspectRatio: false,
    }

    return (
        <Layout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">数据分析</h2>
                    <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4"/>
                                    {date ? format(date, "yyyy年MM月dd日", {locale: zhCN}) : "选择日期"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar mode="single" selected={date} onSelect={setDate} locale={zhCN}/>
                            </PopoverContent>
                        </Popover>
                        <Select defaultValue="30days">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="选择时间范围"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7days">最近7天</SelectItem>
                                <SelectItem value="30days">最近30天</SelectItem>
                                <SelectItem value="90days">最近90天</SelectItem>
                                <SelectItem value="year">今年</SelectItem>
                                <SelectItem value="all">全部时间</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4"/>
                            导出报告
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">概览</TabsTrigger>
                        <TabsTrigger value="traffic">流量分析</TabsTrigger>
                        <TabsTrigger value="content">内容分析</TabsTrigger>
                        <TabsTrigger value="visitors">访客分析</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">总访问量</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">45,231</div>
                                    <p className="text-xs text-muted-foreground">较上月 +18.2%</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">独立访客</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">12,543</div>
                                    <p className="text-xs text-muted-foreground">较上月 +12.5%</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">平均停留时间</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">3分42秒</div>
                                    <p className="text-xs text-muted-foreground">较上月 +0.8%</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">跳出率</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">32.4%</div>
                                    <p className="text-xs text-muted-foreground">较上月 -2.1%</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>访问趋势</CardTitle>
                                    <CardDescription>过去30天的网站访问量</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <div className="h-[300px]">
                                        <Line data={visitData} options={chartOptions}/>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>内容分类</CardTitle>
                                    <CardDescription>按类别划分的内容分布</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <Bar data={categoryData} options={chartOptions}/>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>热门文章</CardTitle>
                                    <CardDescription>访问量最高的文章</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {popularPosts.map((post, index) => (
                                            <div key={post.id}
                                                 className="flex items-center justify-between border-b pb-2">
                                                <div className="flex items-start gap-2">
                                                    <div
                                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-medium">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{post.title}</p>
                                                        <div
                                                            className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <span>浏览: {post.views}</span>
                                                            <span>•</span>
                                                            <span>评论: {post.comments}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>访问设备</CardTitle>
                                    <CardDescription>按设备类型划分的访问比例</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <Pie data={deviceData} options={pieOptions}/>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="traffic" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>流量来源分析</CardTitle>
                                <CardDescription>了解您的访问者来自哪里</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[400px]">
                                    <Bar
                                        data={{
                                            labels: ["搜索引擎", "直接访问", "社交媒体", "外部链接", "电子邮件", "其他"],
                                            datasets: [
                                                {
                                                    label: "访问量",
                                                    data: [12453, 8765, 5432, 3210, 1987, 876],
                                                    backgroundColor: "hsl(var(--primary) / 0.8)",
                                                },
                                            ],
                                        }}
                                        options={chartOptions}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>IP地址访问统计</CardTitle>
                                <CardDescription>访问量最高的IP地址</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <table className="w-full">
                                        <thead>
                                        <tr className="border-b">
                                            <th className="h-10 px-4 text-left font-medium">IP地址</th>
                                            <th className="h-10 px-4 text-left font-medium">位置</th>
                                            <th className="h-10 px-4 text-left font-medium">访问次数</th>
                                            <th className="h-10 px-4 text-left font-medium">最后访问时间</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {ipData.map((item, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="p-4 align-middle">{item.ip}</td>
                                                <td className="p-4 align-middle">{item.location}</td>
                                                <td className="p-4 align-middle">{item.visits}</td>
                                                <td className="p-4 align-middle">{item.lastVisit}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="content" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>内容性能分析</CardTitle>
                                <CardDescription>了解哪些内容表现最好</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-medium">按分类的内容性能</h3>
                                        <div className="h-[300px]">
                                            <Bar
                                                data={{
                                                    labels: ["科技", "生活", "旅行", "美食", "教育", "健康"],
                                                    datasets: [
                                                        {
                                                            label: "平均浏览量",
                                                            data: [1245, 876, 932, 654, 789, 543],
                                                            backgroundColor: "hsl(var(--primary) / 0.8)",
                                                        },
                                                        {
                                                            label: "平均评论数",
                                                            data: [32, 24, 28, 18, 22, 15],
                                                            backgroundColor: "hsl(var(--accent) / 0.8)",
                                                        },
                                                    ],
                                                }}
                                                options={chartOptions}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-lg font-medium">内容长度与性能关系</h3>
                                        <div className="h-[300px]">
                                            <Line
                                                data={{
                                                    labels: ["500字以下", "500-1000字", "1000-1500字", "1500-2000字", "2000-3000字", "3000字以上"],
                                                    datasets: [
                                                        {
                                                            label: "平均浏览量",
                                                            data: [543, 765, 987, 1243, 1456, 1234],
                                                            borderColor: "hsl(var(--primary))",
                                                            backgroundColor: "hsl(var(--primary) / 0.1)",
                                                            tension: 0.3,
                                                        },
                                                        {
                                                            label: "平均停留时间(秒)",
                                                            data: [60, 120, 180, 240, 300, 360],
                                                            borderColor: "hsl(var(--accent))",
                                                            backgroundColor: "hsl(var(--accent) / 0.1)",
                                                            tension: 0.3,
                                                        },
                                                    ],
                                                }}
                                                options={chartOptions}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="visitors" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>访客地域分布</CardTitle>
                                <CardDescription>了解您的访客来自哪些地区</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[400px]">
                                    <Bar
                                        data={{
                                            labels: ["北京", "上海", "广州", "深圳", "成都", "杭州", "武汉", "南京", "其他"],
                                            datasets: [
                                                {
                                                    label: "访问量",
                                                    data: [5432, 4876, 3654, 3210, 2987, 2654, 2432, 2210, 8765],
                                                    backgroundColor: "hsl(var(--primary) / 0.8)",
                                                },
                                            ],
                                        }}
                                        options={chartOptions}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>访客行为分析</CardTitle>
                                <CardDescription>了解访客在网站上的行为</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <h3 className="text-lg font-medium mb-4">访问时段分布</h3>
                                        <div className="h-[300px]">
                                            <Line
                                                data={{
                                                    labels: [
                                                        "0-2",
                                                        "2-4",
                                                        "4-6",
                                                        "6-8",
                                                        "8-10",
                                                        "10-12",
                                                        "12-14",
                                                        "14-16",
                                                        "16-18",
                                                        "18-20",
                                                        "20-22",
                                                        "22-24",
                                                    ],
                                                    datasets: [
                                                        {
                                                            label: "访问量",
                                                            data: [543, 321, 210, 432, 1234, 2345, 2876, 3210, 3654, 4321, 3987, 2345],
                                                            borderColor: "hsl(var(--primary))",
                                                            backgroundColor: "hsl(var(--primary) / 0.1)",
                                                            tension: 0.3,
                                                            fill: true,
                                                        },
                                                    ],
                                                }}
                                                options={chartOptions}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium mb-4">访问深度分布</h3>
                                        <div className="h-[300px]">
                                            <Pie
                                                data={{
                                                    labels: ["1页", "2页", "3页", "4页", "5页及以上"],
                                                    datasets: [
                                                        {
                                                            label: "访客比例",
                                                            data: [45, 25, 15, 10, 5],
                                                            backgroundColor: [
                                                                "hsl(var(--primary) / 0.8)",
                                                                "hsl(var(--accent) / 0.8)",
                                                                "hsl(215 100% 50% / 0.8)",
                                                                "hsl(142 76% 36% / 0.8)",
                                                                "hsl(262 83% 58% / 0.8)",
                                                            ],
                                                        },
                                                    ],
                                                }}
                                                options={pieOptions}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>

    )
}
