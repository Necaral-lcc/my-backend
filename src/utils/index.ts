import * as moment from 'moment'

export const isEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return regex.test(email)
}

export const isPassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return regex.test(password)
}

export const isNumber = (num: any) => {
  const regex = /^\d+$/
  return regex.test(num)
}

interface sFormatResponse {
  msg: string
  data?: any
  code: number
  [key: string]: any
}

export const formatResponse = (
  data: any,
  msg: string = 'success',
  code: number = 200,
  ext?: Object
) => {
  let res: sFormatResponse = {
    msg,
    code,
    ...ext,
  }
  if (data) {
    res.data = data
  }

  return res
}

export const formatPageResponse = (
  list: any[],
  page: number,
  pageSize: number,
  total: number = 0
) => {
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
