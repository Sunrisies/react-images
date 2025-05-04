import styles from "@/assets/styles/login.module.css";
import {
  LoginAndRegisterType,
  usePostLogin,
  usePostRegister,
} from "@/services/login";
import { createLazyFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
// import {Button, Form, Input} from 'antd'
import { useState } from "react";
import { useLoginApi } from "@/services/auth";

export const Route = createLazyFileRoute("/auth/login")({
  component: AuthPage,
});

function AuthPage() {
  const useAuth = useLoginApi()
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState<'username' | 'email'>('username');
  const navigate = useNavigate();

  const handleSubmit = async (
    e: React.FormEvent,
    action: "login" | "register"
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (action === "login") {
      const formElement = e.target as HTMLFormElement;
      const username = formElement.elements.namedItem("username") as HTMLInputElement;
      const email = formElement.elements.namedItem("email") as HTMLInputElement;
      const password = formElement.elements.namedItem("password") as HTMLInputElement;

      // 邮箱正则
      const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      // 密码正则
      // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

      // 验证输入
      if (loginType === 'email' && !emailRegex.test(email.value)) {
        setError("请输入有效的邮箱地址");
        setIsLoading(false);
        return;
      }

      // if (!passwordRegex.test(password.value)) {
      //   setError("密码必须包含字母和数字，且长度至少为8位");
      //   setIsLoading(false);
      //   return;
      // }
        await useAuth.mutateAsync({
          ...(loginType === 'username' ? { user_name: username.value } : { email: email.value }),
          pass_word: password.value
        });
    } else {
      // 处理注册逻辑
      // ... existing code ...
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-4xl flex shadow-2xl rounded-2xl overflow-hidden">
        {/* 左侧装饰区域 */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-red-500 to-amber-500 p-12 text-white">
          <h2 className="text-4xl font-bold mb-6">欢迎来到博客管理系统</h2>
          <p className="text-lg mb-8">登录或注册您的账户以开始管理您的博客</p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <User className="w-5 h-5" />
              </div>
              <p>个性化的博客管理体验</p>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <Lock className="w-5 h-5" />
              </div>
              <p>安全可靠的账户保护</p>
            </div>
          </div>
        </div>

        {/* 右侧表单 */}
        <Card className="w-full md:w-1/2 border-none shadow-none">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-amber-500 rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-bold text-white">博</span>
              </div>
            </div>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">登录</TabsTrigger>
                <TabsTrigger value="register">注册</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={(e) => handleSubmit(e, "login")}>
                  <CardContent className="space-y-4">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setLoginType(loginType === 'username' ? 'email' : 'username')}
                      >
                        切换到{loginType === 'username' ? '邮箱' : '用户名'}登录
                      </Button>
                    </div>
                    {loginType === 'username' ? (
                      <div className="space-y-2">
                        <Label htmlFor="username">用户名</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="username"
                            placeholder="请输入用户名"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="email">邮箱</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="请输入邮箱"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="password">密码</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="请输入密码"
                          className="pl-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-8 w-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "隐藏密码" : "显示密码"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "登录中..." : "登录"}
                    </Button>
                    <div className="mt-4 text-center text-sm">
                      <Link
                        to="/auth/forgot-password"
                        className="text-primary hover:underline"
                      >
                        忘记密码?
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={(e) => handleSubmit(e, "register")}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-email">邮箱</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="请输入邮箱"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">密码</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="请输入密码"
                          className="pl-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-8 w-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "隐藏密码" : "显示密码"}
                          </span>
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">确认密码</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="请再次输入密码"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "注册中..." : "注册"}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </CardHeader>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </Card>
      </div>
    </div>
  );
}
