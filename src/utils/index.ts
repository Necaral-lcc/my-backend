import * as moment from 'moment'

/**
 * 邮箱验证
 * @name: isEmail
 * @description: 验证邮箱格式
 * @param email
 * @returns boolean
 */
export const isEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return regex.test(email)
}

/**
 * 密码验证
 * @name: isPassword
 * @description: 验证密码格式
 * @param password 密码
 * @returns boolean
 */
export const isPassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return regex.test(password)
}

/**
 * 数字验证
 * @name: isNumber
 * @description: 验证数字格式
 * @param num
 * @returns boolean
 */
export const isNumber = (num: any) => {
  const regex = /^\d+$/
  return regex.test(num)
}
/**
 * 格式化返回数据接口
 */
interface sFormatResponse<T = any> {
  msg: string
  data?: T
  code: number
  [key: string]: any
}

/**
 * 格式化返回数据
 * @name: formatResponse
 * @description: 格式化返回数据
 * @param data 返回数据
 * @param msg 返回消息
 * @param code 返回状态码
 * @param ext 额外参数
 * @returns sFormatResponse
 */
export const formatResponse = <T>(
  data: T,
  msg: string = 'success',
  code: number = 200,
  ext?: Object
) => {
  let res: sFormatResponse<T> = {
    msg,
    code,
    ...ext,
  }
  if (data) {
    res.data = data
  }
  return res
}

export interface sPageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * 格式化分页数据
 * @name: formatPageResponse
 * @description: 格式化分页数据
 * @param list 数据列表
 * @param page 当前页码
 * @param pageSize 每页条数
 * @param total 总条数
 * @returns sPageResponse<T>
 * @example
 * formatPageResponse([1,2,3], 1, 10, 30)
 * // {
 * //   list: [1,2,3],
 * //   total: 30,
 * //   page: 1,
 * //   pageSize: 10
 * // }
 */
export const formatPageResponse = <T = any>(
  list: T[],
  page: number,
  pageSize: number,
  total: number = 0
): sPageResponse<T> => {
  return {
    list,
    total,
    page,
    pageSize,
  }
}

export const utcOffset = (utc: string, offset: number) => {
  return moment.utc(utc).utcOffset(offset).format('YYYY/MM/DD HH:mm:ss')
}
