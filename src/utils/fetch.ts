// export const  请求
// export const request = async (args) => {
//   return
//   // return await fetch('http://localhost:3000/api/' + args.url, {
//   //   method: args.method || 'GET',
//   //   headers: {
//   //     'Content-Type': 'application/json'
//   //   },
//   //   body: JSON.stringify(args.data)
//   // })
// }
type RequestType<T> = {
  code: number
  message: string
  data: T
}
class Request {
  constructor(private BaseUrl: string) {
    this.BaseUrl = BaseUrl
  }
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
      },
    })
    if (response.ok) {
      return (await response.json()) as RequestType<U>
    }
    return Promise.reject(response.statusText)
    // console.log(response)
    // return (await fetch(this.BaseUrl + url, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    // }))
  }

  async post<T, U>(url: string, data: T): Promise<U> {
    return (await fetch(this.BaseUrl + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })) as U
  }
}
export const request = new Request('https://blog.chaoyang1024.top:2345/api')
