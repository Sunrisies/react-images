import {createFileRoute, Link} from '@tanstack/react-router'
import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Mail} from "lucide-react"

export const Route = createFileRoute('/auth/forgot-password')({
    component: RouteComponent,
})

function RouteComponent() {
    const [email, setEmail] = useState("")
    const [captcha, setCaptcha] = useState("") // 新增验证码状态
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage("")

        // 这里应该是实际的密码重置逻辑
        setTimeout(() => {
            setIsLoading(false)
            setMessage("如果该邮箱已注册，我们已发送密码重置链接。请检查您的邮箱。")
        }, 1500)
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">找回密码</CardTitle>
                    <CardDescription className="text-center">输入您的邮箱地址，我们将发送密码重置链接</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">邮箱</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="请输入邮箱"
                                    className="pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">验证码</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="请输入验证码"
                                    className="pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "发送中..." : "提交"}
                        </Button>
                        {message && <p className="mt-4 text-sm text-center text-green-600">{message}</p>}
                        <div className="mt-4 text-center text-sm">
                            <Link href="/auth/login" className="text-primary hover:underline">
                                返回登录
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
