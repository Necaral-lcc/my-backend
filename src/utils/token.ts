import * as jwt from 'jsonwebtoken'
import { ADMIN_SECRET_KEY, JWT_EXPIRE_TIME } from '../config'

export const createToken = <T extends Object>(
  data: T,
  expiresIn: number | string = JWT_EXPIRE_TIME
) => {
  return jwt.sign(data, ADMIN_SECRET_KEY, {
    expiresIn,
  })
}
