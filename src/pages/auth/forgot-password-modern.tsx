import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@tanstack/react-router"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, ArrowLeft, Key, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import "@/assets/styles/auth-responsive.css"

export default function ModernForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [captcha, setCaptcha] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [step, setStep] = useState<"email" | "verify">("email")
  const [countdown, setCountdown] = useState(0)
  const [isResending, setIsResending] = useState(false)

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("请输入有效的邮箱地址")
      setIsLoading(false)
      return
    }

    try {
      if (step === "email") {
        // Simulate sending verification code
        await new Promise(resolve => setTimeout(resolve, 1500))
        setMessage("验证码已发送到您的邮箱，请查收")
        setStep("verify")
        setCountdown(60) // Start 60 second countdown
        toast.success("验证码发送成功")
      } else {
        // Simulate verification
        await new Promise(resolve => setTimeout(resolve, 1500))
        setMessage("密码重置链接已发送到您的邮箱")
        toast.success("验证成功，请查看邮箱")
      }
    } catch (error) {
      toast.error("操作失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (countdown > 0) return
    
    setIsResending(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCountdown(60)
      toast.success("验证码已重新发送")
    } catch (error) {
      toast.error("发送失败，请重试")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background with performance optimizations */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-purple-500/10 to-amber-500/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-red-500/20 to-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 auth-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md auth-form-section"
        >
          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex justify-center mb-4"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Key className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CardTitle className="text-2xl font-bold text-white">
                  {step === "email" ? "找回密码" : "验证邮箱"}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {step === "email" 
                    ? "输入您的邮箱地址，我们将发送验证码" 
                    : "请输入您收到的验证码"
                  }
                </CardDescription>
              </motion.div>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {step === "email" ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="email" className="text-gray-300">邮箱地址</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="请输入您的邮箱"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="email" className="text-gray-300">邮箱地址</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          disabled
                          className="pl-10 bg-white/10 border-white/20 text-gray-400"
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="captcha" className="text-gray-300">验证码</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="captcha"
                          type="text"
                          placeholder="请输入验证码"
                          value={captcha}
                          onChange={(e) => setCaptcha(e.target.value)}
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 px-2 text-xs text-amber-400 hover:text-amber-300"
                          onClick={handleResendCode}
                          disabled={countdown > 0 || isResending}
                        >
                          {countdown > 0 ? `${countdown}s` : isResending ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            "重新发送"
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  </>
                )}
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="w-full space-y-3"
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-semibold btn-touch-target"
                    disabled={isLoading}
                  >
                    {isLoading ? "处理中..." : (step === "email" ? "发送验证码" : "重置密码")}
                  </Button>
                  
                  <Link to="/auth/login" className="block">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 btn-touch-target"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      返回登录
                    </Button>
                  </Link>
                </motion.div>
                
                {message && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-center text-green-400"
                  >
                    {message}
                  </motion.p>
                )}
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 auth-footer">
        <div className="text-center text-sm text-gray-400">
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