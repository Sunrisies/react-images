import { warehouseType } from "@/services"
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    type ChartOptions,
} from "chart.js"
import { useMemo } from "react"
import { Bar, Line } from "react-chartjs-2"
import { useTheme } from "./theme-provider"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export function LineChart() {
    const data = {
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

    const options: ChartOptions<"line"> = {
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

    return (
        <div className="h-[300px]">
            <Line data={data} options={options}/>
        </div>
    )
}

export function BarChart() {
    const data = {
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

    const options: ChartOptions<"bar"> = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
        },
        maintainAspectRatio: false,
    }

    return (
        <div className="h-[300px]">
            <Bar data={data} options={options}/>
        </div>
    )
}

export function DateCountChart({ data }: { data: warehouseType[] }) {
    const { theme } = useTheme() // 新增主题hook
  
    // 添加theme到依赖项
    const chartData = useMemo(() => {
       return {
            labels: data.map(item => item[0]),
                datasets: [
                    {
                        label: "数量",
                        data: data.map(item => item[1]),
                        borderColor: theme === 'light' ? "hsl(var(--muted-foreground))" : "#fff",  // 设置线条颜色为主题色，不加透明度
                        backgroundColor:theme === 'light' ? "hsl(var(--muted-foreground) / 0.1)" :"#fff",  // 填充区域使用低透明度
                        tension: 0.3,
                        fill: true,
                    },
                ],
    }
    }, [data, theme]) // 添加theme依赖
 
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#222",
        titleColor: "#fff",
        bodyColor: "#fff"
      }
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#bbb" },
        grid: { color: "rgba(180,180,180,0.15)" }
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#bbb" },
        grid: { color: "rgba(180,180,180,0.15)" },
      }
    },
  }

  return <div className="h-[300px]"><Line redraw={true} data={chartData} options={options} /></div>
}

