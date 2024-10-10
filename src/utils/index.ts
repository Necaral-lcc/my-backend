export const isEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return regex.test(email)
}

export const isPassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return regex.test(password)
}

export const formatResponse = (
  data: any,
  message: string = 'success',
  status: number = 200,
  ext?: Object
) => {
  return {
    data,
    message,
    status,
    ...ext,
  }
}
