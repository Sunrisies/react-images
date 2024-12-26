import axios from 'axios'
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
    function (response) {
      console.log(response.data,'====')
      // 2xx 范围内的状态码都会触发该函数。
      // // 对响应数据做点什么
      if (response.data.code === 200) {
        return response.data
      }
      return response
    },
    function (error) {
      // 超出 2xx 范围的状态码都会触发该函数。
      // 对响应错误做点什么
      return Promise.reject(error)
    }
  )
  return { http }
}
