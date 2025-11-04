
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Home, Mail } from "lucide-react"
import { Link, useLocation } from "@tanstack/react-router"

interface ErrorProps {
    // error: Error & { digest?: string }
    reset: () => void
}

export default function Error({ reset }: ErrorProps) {


    // 判断是否为500错误或其他类型错误
    const isServerError = true
    const errorCode = isServerError ? "500" : "错误"
    const errorTitle = isServerError ? "服务器内部错误" : "出错了"
    const errorMessage = isServerError
        ? "我们遇到了一些技术问题，我们的团队已收到通知并正在努力解决。"
        : "处理您的请求时发生了意外错误。"

    return (
        <div className="flex h-full flex-col items-center justify-center overflow-hidden px-4 relative">
            {/* 背景装饰元素 */ }
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-blue-300/20 rounded-full blur-2xl animate-bounce"></div>
            </div>

            {/* 主要内容 */ }
            <div className="text-center relative">
                {/* 错误代码动画 */ }
                <div className="text-center relative">
                    <div className="relative mb-8">
                        <h1 className="xs:text-[4.5rem] xs:leading-[4.5rem] tb:text-[7rem] tb:leading-[7rem] pc:text-[8.5rem] pc:leading-[8.5rem] font-black text-primary animate-float-404 drop-shadow-lg">
                            { errorCode }
                        </h1>
                    </div>
                </div>

                {/* 副标题 */ }
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                    { errorTitle }
                </h2>

                {/* 描述文字 */ }
                <div className="max-w-md mx-auto mb-8">
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        { errorMessage }
                    </p>
                    { !isServerError && (
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-4">
                            请重试或联系支持团队。
                        </p>
                    ) }
                </div>

                {/* 操作按钮组 */ }
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        onClick={ reset }
                        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-105 shadow-lg"
                    >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        重试
                    </Button>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-md border border-primary/20 px-6 py-3 text-base font-medium text-primary transition-all duration-300 hover:bg-primary/10 hover:scale-105"
                        >
                            <Home className="w-5 h-5 mr-2" />
                            返回首页
                        </Link>

                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-md border border-primary/20 px-6 py-3 text-base font-medium text-primary transition-all duration-300 hover:bg-primary/10 hover:scale-105"
                        >
                            <Mail className="w-5 h-5 mr-2" />
                            联系支持
                        </Link>
                    </div>
                </div>

                {/* 额外的帮助文本 */ }
                <p className="mt-8 text-sm text-muted-foreground max-w-xs mx-auto">
                    如果此错误持续出现，请联系我们的支持团队
                </p>
            </div>

            {/* 浮动元素 */ }
            <div className="absolute bottom-10 left-10 w-8 h-8 bg-primary/20 rounded-full animate-bounce delay-300 hidden md:block"></div>
            <div className="absolute top-10 right-10 w-6 h-6 bg-blue-300/30 rounded-full animate-bounce delay-700 hidden md:block"></div>
            <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-green-300/20 rounded-full animate-ping delay-1000 hidden lg:block"></div>
        </div>
    )
}