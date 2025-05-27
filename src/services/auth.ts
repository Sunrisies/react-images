import { request } from '@/utils/fetch';
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
interface LoginParams {
  user_name?: string;
  email?: string;
  method: 'email' | 'password' | 'phone' | 'email-password'
  pass_word: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    user_name: string;
    email?: string;
  }
}

// 登录
export const useLoginApi = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (params: LoginParams) => {
      const { data, code, message } = await request.post<LoginParams, LoginResponse>('/auth/login', params);
      console.log(data, code, message);
      if (code === 200) {
        sessionStorage.setItem('token', data.access_token);
        toast.success(message || "登录成功");
        navigate({ to: "/dashboard" });
      }
    },
  });
};