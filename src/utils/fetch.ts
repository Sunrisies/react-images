type RequestType<T> = {
  code: number
  message: string
  data: T
}
function RequestInterceptor<T, U>(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value as (url: string, data: T,config:any) => Promise<RequestType<U>>

  descriptor.value = async function (url: string, data: T): Promise<RequestType<U>> {
    // 请求拦截器逻辑
    console.log('请求拦截器：', url, data)
    const token = sessionStorage.getItem('token')
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      }
    }
    // 调用原始方法
    const response = await originalMethod.apply(this, [url, data,config])
    console.log(response,'response')
    return response
  }

  return descriptor
}

function ResponseInterceptor(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value

  descriptor.value = async function (...args: any[]) {
    const response = await originalMethod.apply(this, args)

    // 响应拦截器逻辑
    console.log('响应拦截器：', response)

    // 统一处理响应数据
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    return response.json()
  }

  return descriptor
}
class Request {
  constructor(private readonly BaseUrl: string) {
    this.BaseUrl = BaseUrl
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
   * @returns {Promise<RequestType<U> | Error>} - 返回一个 Promise，解析为请求的数据或错误信息。
   *
   * @throws {Error} - 如果请求失败，抛出错误信息。
   */
  async get<U>(url: string): Promise<RequestType<U>> // 当没有 data 参数时的重载
  async get<U, T>(url: string, data: T): Promise<RequestType<U>> // 当有 data 参数时的重载
  async get<U, T>(url: string, data?: T): Promise<RequestType<U> | Error> {
    console.log(this.BaseUrl + url)
    // 如果 data 存在，将其转换为查询参数
    if (data) {
      const queryParams = new URLSearchParams(data).toString()
      url += `?${queryParams}` // 将查询参数追加到 URL
    }
    const response = await fetch(this.BaseUrl + url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (response.ok) {
      return (await response.json()) as RequestType<U>
    }
    return Promise.reject(response.statusText)
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
   * @returns {Promise<RequestType<U>>} - 返回一个 Promise，解析为请求的数据。
   *
   * @throws {Error} - 如果请求失败，抛出错误信息。
   */
  @RequestInterceptor
  async post<T, U>(url: string, data: T,config:any): Promise<RequestType<U>> {
    const response = await fetch(this.BaseUrl + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    console.log(config,'config')
    if (response.ok) {
      return (await response.json()) as RequestType<U>
    }
    return Promise.reject(response.statusText)
  }
  /** 上传文件 */

  async upload(url: string, body: FormData): Promise<any> {
    const response = await fetch(this.BaseUrl + url, {
      method: 'POST',
      body,
      redirect: 'follow'
    })
    if (response.ok) {
      return await response.json()
    }
    return Promise.reject(response.statusText)
  }
}
export const request = new Request('https://api.chaoyang1024.top:2345/api')
