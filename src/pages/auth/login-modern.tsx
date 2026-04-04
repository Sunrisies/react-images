import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLoginApi } from "@/services/auth"
import { Link, useNavigate } from "@tanstack/react-router"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Mail, User, Lock, Github, Chrome } from "lucide-react"
import { toast } from "sonner"
import "@/assets/styles/auth-optimized.css"

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

interface FormData {
  account: string
  email: string
  password: string
  confirmPassword: string
  rememberMe: boolean
  agreeToTerms: boolean
}

interface FormErrors {
  account?: string
  email?: string
  password?: string
  confirmPassword?: string
  agreeToTerms?: string
}

export default function ModernAuthPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  const [activeTab, setActiveTab] = useState("login")
  const [loginType, setLoginType] = useState<"account" | "email">("account")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const [formData, setFormData] = useState<FormData>({
    account: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    agreeToTerms: false
  })

  const useAuth = useLoginApi()
  const navigate = useNavigate()

  // Particle animation effect with performance optimizations
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Performance checks
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isLowEndDevice = navigator.hardwareConcurrency <= 2
    const isMobile = window.innerWidth <= 768

    if (prefersReducedMotion) {
      canvas.style.display = 'none'
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Adjust particle count based on device performance
    const particleCount = isLowEndDevice ? 15 : (isMobile ? 25 : 40)

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticle = (): Particle => ({
      id: Math.random(),
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      color: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"][Math.floor(Math.random() * 5)]
    })

    const initParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, createParticle)
    }

    let lastTime = 0
    const animate = (currentTime: number) => {
      // Throttle animation for performance
      if (currentTime - lastTime < 16) { // ~60fps
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastTime = currentTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initParticles()
    animate(0)

    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const validateForm = (tab: "login" | "register"): boolean => {
    const newErrors: FormErrors = {}

    if (tab === "login") {
      if (loginType === "account" && !formData.account.trim()) {
        newErrors.account = "请输入用户名"
      }
      if (loginType === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email.trim()) {
          newErrors.email = "请输入邮箱地址"
        } else if (!emailRegex.test(formData.email)) {
          newErrors.email = "请输入有效的邮箱地址"
        }
      }
      if (!formData.password) {
        newErrors.password = "请输入密码"
      } else if (formData.password.length < 6) {
        newErrors.password = "密码长度至少为6位"
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!formData.email.trim()) {
        newErrors.email = "请输入邮箱地址"
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "请输入有效的邮箱地址"
      }
      if (!formData.password) {
        newErrors.password = "请输入密码"
      } else if (formData.password.length < 6) {
        newErrors.password = "密码长度至少为6位"
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "两次输入的密码不一致"
      }
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "请同意用户协议"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (field in errors) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent, action: "login" | "register") => {
    e.preventDefault()

    if (!validateForm(action)) {
      toast.error("请检查输入内容")
      return
    }

    setIsLoading(true)

    try {
      if (action === "login") {
        await useAuth.mutateAsync({
          ...(loginType === "account" ? { account: formData.account } : { email: formData.email }),
          password: formData.password,
          login_type: loginType === "account" ? "password" : "email-password"
        })
      } else {
        // Registration logic would go here
        toast.success("注册成功！请登录")
        setActiveTab("login")
        // Reset form
        setFormData(prev => ({
          ...prev,
          email: "",
          password: "",
          confirmPassword: "",
          agreeToTerms: false
        }))
      }
    } catch (error) {
      console.error("Authentication error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative h-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */ }
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */ }
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-500/30 rounded-full blur-3xl animate-pulse" style={ { animationDuration: '4s' } } />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/30 rounded-full blur-3xl animate-pulse" style={ { animationDuration: '5s', animationDelay: '1s' } } />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl" />

        {/* Grid Pattern */ }
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Particle Canvas */ }
      <canvas
        ref={ canvasRef }
        className="absolute inset-0 w-full h-full"
        style={ { background: "transparent" } }
      />

      {/* Gradient Overlay */ }
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-purple-500/10 to-amber-500/10" />

      {/* Main Content - Centered Auth Card */ }
      <div className="auth-container">
        <motion.div
          initial={ { opacity: 0, scale: 0.95 } }
          animate={ { opacity: 1, scale: 1 } }
          transition={ { duration: 0.5, ease: "easeOut" } }
          className="main-content"
        >
          {/* Brand Header - Mobile Only */ }
          <motion.div
            initial={ { opacity: 0, y: -20 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.6, delay: 0.2 } }
            className="text-center mb-8 lg:hidden"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-amber-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">博</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
                  博客管理系统
                </h1>
                <p className="text-sm text-gray-300">开启您的创作之旅</p>
              </div>
            </div>
          </motion.div>

          {/* Auth Card */ }
          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="space-y-1 text-center pb-6">
              <CardTitle className="text-2xl font-bold text-white">
                { activeTab === "login" ? "欢迎回来" : "创建账户" }
              </CardTitle>
              <CardDescription className="text-gray-300">
                { activeTab === "login" ? "登录您的账户继续创作" : "注册新账户开始博客之旅" }
              </CardDescription>
            </CardHeader>

            <Tabs value={ activeTab } onValueChange={ setActiveTab } className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 mb-6">
                <TabsTrigger value="login" className="data-[state=active]:bg-white/20 text-white">
                  登录
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-white/20 text-white">
                  注册
                </TabsTrigger>
              </TabsList>

              <CardContent className="space-y-4">
                <TabsContent value="login" className="space-y-4 mt-0">
                  <form onSubmit={ (e) => handleSubmit(e, "login") } className="space-y-4">
                    <div className="flex justify-end mb-2">
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        onClick={ () => setLoginType(loginType === "account" ? "email" : "account") }
                        className="text-gray-300 hover:text-white p-0 h-auto text-sm"
                      >
                        切换到{ loginType === "account" ? "邮箱" : "用户名" }登录
                      </Button>
                    </div>

                    <AnimatePresence mode="wait">
                      { loginType === "account" ? (
                        <motion.div
                          key="account"
                          initial={ { opacity: 0, x: -20 } }
                          animate={ { opacity: 1, x: 0 } }
                          exit={ { opacity: 0, x: 20 } }
                          transition={ { duration: 0.2 } }
                          className="space-y-2"
                        >
                          <Label htmlFor="account" className="text-gray-300 text-sm">用户名</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="account"
                              placeholder="请输入用户名"
                              value={ formData.account }
                              onChange={ (e) => handleInputChange("account", e.target.value) }
                              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                          { errors.account && <p className="text-red-400 text-xs mt-1">{ errors.account }</p> }
                        </motion.div>
                      ) : (
                        <motion.div
                          key="email"
                          initial={ { opacity: 0, x: -20 } }
                          animate={ { opacity: 1, x: 0 } }
                          exit={ { opacity: 0, x: 20 } }
                          transition={ { duration: 0.2 } }
                          className="space-y-2"
                        >
                          <Label htmlFor="email" className="text-gray-300 text-sm">邮箱</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="请输入邮箱"
                              value={ formData.email }
                              onChange={ (e) => handleInputChange("email", e.target.value) }
                              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                          { errors.email && <p className="text-red-400 text-xs mt-1">{ errors.email }</p> }
                        </motion.div>
                      ) }
                    </AnimatePresence>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-300 text-sm">密码</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={ showPassword ? "text" : "password" }
                          placeholder="请输入密码"
                          value={ formData.password }
                          onChange={ (e) => handleInputChange("password", e.target.value) }
                          className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-white"
                          onClick={ () => setShowPassword(!showPassword) }
                        >
                          { showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" /> }
                        </Button>
                      </div>
                      { errors.password && <p className="text-red-400 text-xs mt-1">{ errors.password }</p> }
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={ formData.rememberMe }
                        onChange={ (e) => handleInputChange("rememberMe", e.target.checked) }
                        className="h-4 w-4 rounded border-white/20 bg-white/10 text-red-500 focus:ring-red-500 focus:ring-offset-0"
                      />
                      <Label htmlFor="remember" className="text-sm text-gray-300">记住我</Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-semibold py-3"
                      disabled={ isLoading }
                    >
                      { isLoading ? "登录中..." : "登录" }
                    </Button>

                    <div className="text-center">
                      <Link
                        to="/auth/forgot-password"
                        className="text-sm text-gray-400 hover:text-white transition-colors underline"
                      >
                        忘记密码?
                      </Link>
                    </div>
                  </form>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/20" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-transparent px-2 text-gray-400">或使用以下方式登录</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 py-3"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 py-3"
                    >
                      <Chrome className="w-4 h-4 mr-2" />
                      Google
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="register" className="space-y-4 mt-0">
                  <form onSubmit={ (e) => handleSubmit(e, "register") } className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-gray-300 text-sm">邮箱</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="请输入邮箱"
                          value={ formData.email }
                          onChange={ (e) => handleInputChange("email", e.target.value) }
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      { errors.email && <p className="text-red-400 text-xs mt-1">{ errors.email }</p> }
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-gray-300 text-sm">密码</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-password"
                          type={ showPassword ? "text" : "password" }
                          placeholder="请输入密码"
                          value={ formData.password }
                          onChange={ (e) => handleInputChange("password", e.target.value) }
                          className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-white"
                          onClick={ () => setShowPassword(!showPassword) }
                        >
                          { showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" /> }
                        </Button>
                      </div>
                      { errors.password && <p className="text-red-400 text-xs mt-1">{ errors.password }</p> }
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-gray-300 text-sm">确认密码</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirm-password"
                          type={ showConfirmPassword ? "text" : "password" }
                          placeholder="请再次输入密码"
                          value={ formData.confirmPassword }
                          onChange={ (e) => handleInputChange("confirmPassword", e.target.value) }
                          className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-white"
                          onClick={ () => setShowConfirmPassword(!showConfirmPassword) }
                        >
                          { showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" /> }
                        </Button>
                      </div>
                      { errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{ errors.confirmPassword }</p> }
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={ formData.agreeToTerms }
                        onChange={ (e) => handleInputChange("agreeToTerms", e.target.checked) }
                        className="h-4 w-4 rounded border-white/20 bg-white/10 text-red-500 focus:ring-red-500 focus:ring-offset-0"
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-300">
                        我同意
                        <a href="#" className="text-amber-400 hover:text-amber-300 underline mx-1">用户协议</a>
                        和
                        <a href="#" className="text-amber-400 hover:text-amber-300 underline mx-1">隐私政策</a>
                      </Label>
                    </div>
                    { errors.agreeToTerms && <p className="text-red-400 text-xs mt-1">{ errors.agreeToTerms }</p> }

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-semibold py-3"
                      disabled={ isLoading }
                    >
                      { isLoading ? "注册中..." : "注册" }
                    </Button>
                  </form>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>

      {/* Footer */ }
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="text-center text-xs text-gray-400">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            豫ICP备2023028265号-2
          </a>
        </div>
      </div>
    </div>
  )
}