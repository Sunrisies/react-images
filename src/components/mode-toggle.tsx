import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useTheme } from '@/components/theme-provider'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const handleThemeChange = async (event: React.MouseEvent) => {
    // 获取点击位置
    const x = event.clientX
    const y = event.clientY

    // 计算过渡半径（从点击位置到最远角落的距离）
    const transitionRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

    // 判断主题切换方向
    const isDarkToLight = theme === 'dark'

    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        setTheme(isDarkToLight ? 'light' : 'dark')
      })

      // 等待过渡准备就绪
      transition.ready.then(() => {
        // 从亮到暗：使用裁切半径从小到大实现扩散效果
        document.documentElement.animate(
          {
            clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${transitionRadius}px at ${x}px ${y}px)`]
          },
          {
            duration: 1000,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)'
          }
        )
      })
    }
  }
  return (
    <button
      onClick={handleThemeChange}
      className="theme-toggle-button relative h-7 w-14 rounded-full bg-slate-200 transition-colors duration-300 ease-in-out dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
    >
      <div
        className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center
          ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}
          hover:shadow-lg`}
      >
        {theme === 'dark' ? <Moon className="h-4 w-4 text-slate-700" /> : <Sun className="h-4 w-4 text-amber-400" />}
      </div>
    </button>
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button variant="outline" size="icon">
    //       <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    //       <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    //       <span className="sr-only">Toggle theme</span>
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end">
    //     <DropdownMenuItem onClick={() => setTheme("light")}>
    //       Light
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme("dark")}>
    //       Dark
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme("system")}>
    //       System
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  )
}
