import { request } from "@/utils/fetch";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
interface LoginParams {
  user_name?: string;
  email?: string;
  login_type: "email" | "password" | "phone" | "email-password";
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    user_name: string;
    email?: string;
  };
}

// 登录
export const useLoginApi = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (params: LoginParams) => {
      const { data, code, message } = await request.post<
        LoginParams,
        LoginResponse
      >("/v1/auth/login", params);
      console.log(data, code, message);
      if (code === 200) {
        sessionStorage.setItem("token", data.access_token);
        toast.success(message || "登录成功");
        navigate({ to: "/dashboard" });
      }
    },
  });
};
