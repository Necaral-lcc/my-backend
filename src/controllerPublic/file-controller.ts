/**
 * Controller用于接受数据、返回数据给前端
 */
import type { Context } from 'koa'
import * as multer from '@koa/multer'
import * as fs from 'fs'
import { formatResponse } from '../utils'
import * as path from 'path'
import * as mime from 'mime-types'
import fileService from '../servicePublic/file-service'
import { hashFile } from '../utils/bcrypt'

interface sUploadFile {
  name: string
  filePath: string
  mimetype: string
  size: number
  hash: string
}

export const uploadFiles = async (ctx: Context) => {
  if (!ctx.files) {
    ctx.body = formatResponse(null, '上传失败，请选择文件')
    return
  }
  const files = ctx.files as multer.File[]
  try {
    const res = await Promise.all(
      files.map(async (file) => {
        const res = await uploadPromise(file)
        const f = await fileService.create(res)
        return f
      })
    )
    ctx.body = formatResponse(res, '上传成功')
  } catch (err) {
    ctx.body = formatResponse(err, '上传失败')
  }
}

export const uploadFile = async (ctx: Context) => {
  try {
    const res = await uploadPromise(ctx.file)
    if (res) {
      const file = await fileService.create(res)
      ctx.body = formatResponse(file, '上传成功')
    } else {
      ctx.body = formatResponse(null, '上传失败', 500)
    }
  } catch (err) {
    ctx.body = formatResponse(err, '上传失败', 500)
  }
}

const uploadPromise = (file: multer.File) => {
  return new Promise<sUploadFile>((resolve, reject) => {
    const filePath = path.join(
      __dirname,
      '../../uploads/files',
      file.originalname
    )
    fs.writeFile(filePath, file.buffer, (err) => {
      if (err) {
        reject(err)
      } else {
        hashFile(file.buffer).then((hash) => {
          resolve({
            name: file.originalname,
            filePath,
            mimetype: mime.lookup(filePath) || '',
            size: file.size,
            hash,
          })
        })
      }
    })
  })
}

export const readFiles = async (ctx: Context) => {
  try {
    const { filename, type } = ctx.params
    console.log(filename, type)
    let filePath = path.join(__dirname, `../../uploads/`, type, filename)
    console.log('filePath', filePath)
    let file = fs.readFileSync(filePath)
    let mineType = mime.lookup(filePath) || 'text/plain'
    ctx.set('Content-Type', mineType)
    ctx.body = file
  } catch (err) {
    ctx.status = 404
  }
}
