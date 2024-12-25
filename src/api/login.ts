import { request } from '@/utils/fetch'
export type LoginAndRegisterType = {
  user_name: string
  pass_word: string
}
type LoginReturnType = {
	id: number;
	user_name: string;
	pass_word: string;
	image?: any;
	phone?: any;
	email?: any;
	create_time: string;
	update_time: string;
	accessToken: string;
}
/**
 * 登录接口
 * @param {LoginParams} data - 登录参数
 * @returns {Promise<string>} - 返回登录后的token
 */

export const loginApi = async (params: LoginAndRegisterType) => {
  const { code, message, data} = await request.post<LoginAndRegisterType,LoginReturnType>('/auth/login', params)
  if (code === 200) {
    // 添加到本地存储中
    sessionStorage.setItem('token', data.accessToken)
    sessionStorage.setItem('user_id', data.id.toString())
    sessionStorage.setItem('user_name', data.user_name)
    sessionStorage.setItem('image', data.image)
    sessionStorage.setItem('phone', data.phone)
    sessionStorage.setItem('email', data.email)
    sessionStorage.setItem('create_time', data.create_time)
    sessionStorage.setItem('update_time', data.update_time)
    return data

  }
  throw new Error(message)
}
export const registerApi = async (data: LoginAndRegisterType) => {
  const { code, message, } = await request.post('/auth/register', data)
  if (code === 200) {
    // return data
  }
  throw new Error(message)
 }
export const logoutApi = async () => {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('user_id')
  sessionStorage.removeItem('user_name')
  sessionStorage.removeItem('image')
  sessionStorage.removeItem('phone')
  sessionStorage.removeItem('email')
  sessionStorage.removeItem('create_time')
  sessionStorage.removeItem('update_time')
  return true
}