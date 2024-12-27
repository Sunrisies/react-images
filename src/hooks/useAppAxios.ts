import axios, { AxiosError, AxiosResponse } from 'axios'
import { message } from 'antd'
interface Result<T> {
  code: number;
  message: string;
  data: T;
}
export const useAppAxios = () => {
  const http = axios.create({
    baseURL: 'https://api.chaoyang1024.top:2345/api',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
  })
  // 添加请求拦截器
  http.interceptors.request.use(
    function (config) {
      // 在发送请求之前做些什么
      return config
    },
    function (error) {
      // 对请求错误做些什么
      return Promise.reject(error)
    }
  )

  // 添加响应拦截器
  http.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      let msg = "";
      console.log(error.response!.status,'error')
      switch (error.response!.status) {
        case 400:
          msg = "请求错误(400)";
          break;
        case 401:
          msg = "未授权，请重新登录(401)";
          // 这里可以做清空storage并跳转到登录页的操作
          break;
        case 403:
          msg = "拒绝访问(403)";
          break;
        case 404:
          msg = "请求出错(404)";
          break;
        case 408:
          msg = "请求超时(408)";
          break;
        case 500:
          msg = "服务器错误(500)";
          break;
        case 501:
          msg = "服务未实现(501)";
          break;
        case 502:
          msg = "网络错误(502)";
          break;
        case 503:
          msg = "服务不可用(503)";
          break;
        case 504:
          msg = "网络超时(504)";
          break;
        case 505:
          msg = "HTTP版本不受支持(505)";
          break;
        default:
        msg = `连接出错(${error.response!.status})!`;
      }
      console.log(msg)
      message.error(msg)
      // 超出 2xx 范围的状态码都会触发该函数。
      // 对响应错误做点什么
      return Promise.reject(error)
    }
  )
  const post = async <T>(url: string, params?: any, config?: any): Promise<Result<T>> => {
    const { data } = await http.post<Result<T>>(url, params, config)
    return data
  }
  const get = async <T>(url: string, params?: any, config?: any): Promise<Result<T>> => {
    const { data } = await http.get<Result<T>>(url, config)
    return data
  }
  const put = async <T>(url: string, params?: any, config?: any): Promise<Result<T>> => {
    const { data } = await http.put<Result<T>>(url, params, config)
    return data
  }
  const del = async <T>(url: string, params?: any, config?: any): Promise<Result<T>> => {
    const { data } = await http.delete<Result<T>>(url, config)
    return data
  }

  return { http, post, get, put, del }
}
