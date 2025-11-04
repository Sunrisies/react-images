export default function Loading() {
    return (
        <div className="flex h-full flex-col items-center justify-center overflow-hidden px-4 relative">
            {/* 背景装饰元素 - 与错误页面保持一致 */ }
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-blue-300/20 rounded-full blur-2xl animate-bounce"></div>
            </div>

            {/* 主要内容 */ }
            <div className="text-center relative">
                {/* 加载动画 */ }
                <div className="relative mb-8">
                    <div className="w-24 h-24 mx-auto mb-6 relative">
                        {/* 外圈旋转动画 */ }
                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>

                        {/* 内圈旋转动画 - 反向 */ }
                        <div className="absolute inset-4 border-3 border-primary/10 rounded-full"></div>
                        <div className="absolute inset-4 border-3 border-transparent border-b-primary rounded-full animate-spin-reverse"></div>

                        {/* 中心点 */ }
                        <div className="absolute inset-8 bg-primary/30 rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* 标题 */ }
                <h1 className="xs:text-3xl tb:text-4xl pc:text-5xl font-bold text-primary mb-6 animate-pulse">
                    加载中
                </h1>

                {/* 描述文字 */ }
                <div className="max-w-md mx-auto mb-8">
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        <span className="block mb-3">正在为您准备精彩内容，</span>
                        <span className="block">请稍等片刻...</span>
                    </p>
                </div>

                {/* 进度指示器 */ }
                <div className="w-48 h-1 bg-primary/20 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-loading-progress"></div>
                </div>

                {/* 提示文字 */ }
                <p className="mt-6 text-sm text-muted-foreground">
                    这通常只需要几秒钟
                </p>
            </div>

            {/* 浮动元素 - 与错误页面保持一致 */ }
            <div className="absolute bottom-10 left-10 w-8 h-8 bg-primary/20 rounded-full animate-bounce delay-300 hidden md:block"></div>
            <div className="absolute top-10 right-10 w-6 h-6 bg-blue-300/30 rounded-full animate-bounce delay-700 hidden md:block"></div>
            <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-green-300/20 rounded-full animate-ping delay-1000 hidden lg:block"></div>

            {/* 额外的动态点 */ }
            <div className="absolute bottom-20 right-20 w-3 h-3 bg-primary/40 rounded-full animate-pulse delay-500 hidden tb:block"></div>
            <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse delay-1200 hidden tb:block"></div>
        </div>
    )
}