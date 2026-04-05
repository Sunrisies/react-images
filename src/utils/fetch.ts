import { IPagination } from "@/types";
import { toast } from "sonner";

export type GetRequestType<T> = {
  code: number;
  message: string;
  data: {
    data: T;
    pagination?: IPagination;
  };
};
export type PostRequestType<T> = {
  code: number;
  message: string;
  data: T;
};
export type DataOnly<T> = Pick<GetRequestType<T>, "data">["data"];
// 请求配置类型
type RequestConfig = {
  headers?: Record<string, string>;
  method?: string;
  body?: any;
  redirect?: RequestRedirect;
};
// 检查当前是否在登录页面
const isLoginPage = () => {
  return window.location.pathname === "/auth/login";
};
// 错误处理函数类型
type ErrorHandler = (error: any) => void;
const errorHandler: ErrorHandler = (error) => {
  switch (error.code) {
    case 200:
      // toast.success(error.message || '请求成功')
      break;
    case 400:
      if (Array.isArray(error.data)) {
        // 处理验证错误的情况
        const errorMessage = error.data
          .map(
            (error: { field: string; errors: string[] }) =>
              `${error.field}: ${error.errors.join(", ")}`,
          )
          .join("; ");
        toast.error(errorMessage);
      } else {
        toast.error(error.message);
      }
      break;
    case 401:
      console.log("未登录");
      toast.error(error.message || "未登录");
      // 只有当前不在登录页面时才跳转
      if (!isLoginPage()) {
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 50);
      }
      break;
    case 403:
      toast.error(error.message || "没有权限");
      break;
    case 404:
      toast.error(error.message || "请求资源不存在");
      break;
    case 422:
      toast.error(error.message || "请求参数错误");
      break;
    case 500:
      toast.error(error.message || "服务器内部错误");
      break;
    default:
      toast.error(error.message || "请求失败");
      break;
  }
};
// 基础请求方法
const baseFetch = async <T, R = GetRequestType<T> | PostRequestType<T>>(
  url: string,
  config: RequestConfig,
): Promise<R> => {
  const token = sessionStorage.getItem("token");
  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
  const response = await fetch(url, {
    ...config,
    credentials: "include",
    headers: {
      ...defaultHeaders,
      ...config.headers,
    },
  });
  const data = await response.json();
  errorHandler(data);
  return { ...data } as R;
};
function RequestInterceptor<T, U>(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value as (
    url: string,
    data: T,
    config: any,
  ) => Promise<GetRequestType<U>>;

  descriptor.value = async function (
    url: string,
    data: T,
  ): Promise<GetRequestType<U>> {
    // 请求拦截器逻辑
    console.log("请求拦截器：", url, data);
    const token = sessionStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        // Authorization: token ? `Bearer ${token}` : "",
      },
    };
    // 调用原始方法
    const response = await originalMethod.apply(this, [url, data, config]);
    console.log(response, "response");
    return response;
  };

  return descriptor;
}

function ResponseInterceptor(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const response = await originalMethod.apply(this, args);
    return response;
  };

  return descriptor;
}
class Request {
  constructor(private readonly BaseUrl: string) {
    this.BaseUrl = BaseUrl;
  }
  private getFullUrl(url: string): string {
    return this.BaseUrl + url;
  }
  /**
   * 发送一个 GET 请求。
   *
   * @template U - 请求返回的数据类型。
   * @template T - 请求的查询参数类型。
   *
   * @param {string} url - 请求的 URL。
   * @param {T} [data] - 可选的查询参数对象。
   *
   * @returns {Promise<GetRequestType<U> | Error>} - 返回一个 Promise，解析为请求的数据或错误信息。
   *
   * @throws {Error} - 如果请求失败，抛出错误信息。
   */
  async get<U>(url: string): Promise<GetRequestType<U>>; // 当没有 data 参数时的重载
  async get<U, T>(url: string, data: T): Promise<GetRequestType<U>>; // 当有 data 参数时的重载
  async get<U, T>(url: string, data?: T): Promise<GetRequestType<U> | Error> {
    console.log(this.BaseUrl + url);
    const queryUrl = data
      ? `${url}?${new URLSearchParams(data as any).toString()}`
      : url;
    return baseFetch<U, GetRequestType<U>>(this.getFullUrl(queryUrl), {
      method: "GET",
    });
  }
  /**
   * 发送一个 POST 请求。
   *
   * @template T - 请求发送的数据类型。
   * @template U - 请求返回的数据类型。
   *
   * @param {string} url - 请求的 URL。
   * @param {T} data - 发送的数据对象。
   *
   * @returns {Promise<PostRequestType<U>>} - 返回一个 Promise，解析为请求的数据。
   *
   * @throws {Error} - 如果请求失败，抛出错误信息。
   */
  @RequestInterceptor
  @ResponseInterceptor
  async post<T, U>(
    url: string,
    data: T,
    config?: any,
  ): Promise<PostRequestType<U>> {
    return baseFetch<U, PostRequestType<U>>(this.getFullUrl(url), {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
  /**
   * 发送一个 PUT 请求。
   *
   * @template T - 请求发送的数据类型。
   * @template U - 请求返回的数据类型。
   */
  @RequestInterceptor
  @ResponseInterceptor
  async put<T, U>(url: string, data: T): Promise<any> {
    return baseFetch<U>(this.getFullUrl(url), {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * 发送一个 DELETE 请求。
   *
   * @template T - 请求发送的数据类型。
   * @template U - 请求返回的数据类型。
   */
  @RequestInterceptor
  @ResponseInterceptor
  async delete<T, U>(url: string): Promise<any> {
    return baseFetch<U>(this.getFullUrl(url), {
      method: "DELETE",
    });
  }

  /** 上传文件 */

  async upload<U>(url: string, body: FormData): Promise<any> {
    const response = await fetch(this.BaseUrl + url, {
      method: "POST",
      body,
      credentials: "include",
      redirect: "follow",
    });
    if (response.ok) {
      return await response.json();
    }
    return Promise.reject(response.statusText);
  }
}
const BaseUrl = import.meta.env.VITE_PUBLIC_API_URL;
export const request = new Request(BaseUrl);
