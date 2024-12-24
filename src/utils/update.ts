import { message } from 'antd'

import { request } from './fetch'

/**
 * 生成一个唯一的文件名。
 *
 * @param {File} file - 要处理的文件对象。
 *
 * @returns {string} - 返回一个唯一的文件名。
 */
export const generateUniqueFileName = (file: File): string => {
  const timestamp = new Date().getTime()
  const randomNum = Math.floor(Math.random() * 10000)
  return `${timestamp}_${randomNum}_${file.name}`
}

/**
 *  @function 上传图片
 * */
export const uploadImage = async (file: File) => {
  const formData = new FormData()
  const fileName = generateUniqueFileName(file)
  formData.append('file', file, fileName)
  const { code, url } = await request.upload('/upload/image', formData)
  if (code === 200) {
    message.success('上传图片成功')
    return url
  } else {
    message.error('上传图片失败')
    throw new Error('上传图片失败')
  }
}
