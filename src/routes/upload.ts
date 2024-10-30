import type { Context, Middleware } from 'koa'
import * as multer from '@koa/multer'
import * as fs from 'fs'
import { formatResponse } from '@/utils'
import * as path from 'path'

const upload = multer()

const uploadMultiple = upload.array('files', 10)

const uploadSimple = upload.single('file')

const uploadFiles = async (ctx: Context) => {
  if (!ctx.files) {
    ctx.body = formatResponse(null, '上传失败，请选择文件')
    return
  }
  const files = ctx.files as multer.File[]
  try {
    const res = await Promise.all(
      files.map(async (file) => {
        const res = await uploadPromise(file)
        return res
      })
    )
    ctx.body = formatResponse(res, '上传成功')
  } catch (err) {
    ctx.body = formatResponse(err, '上传失败')
  }
}

const uploadFile = async (ctx: Context) => {
  console.log('ctx.file', ctx.file)
  const res = await uploadPromise(ctx.file)
  if (res) {
    ctx.body = formatResponse(res, '上传成功')
  } else {
    ctx.body = formatResponse(null, '上传失败')
  }
}

const uploadPromise = (file: multer.File) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.join(__dirname, '../../uploads/', file.originalname),
      file.buffer,
      (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(file.originalname)
        }
      }
    )
  })
}

export default [
  {
    name: 'upload-multiple',
    type: 'post',
    path: '/upload-multiple',
    middleware: [uploadMultiple],
    action: uploadFiles,
  },
  {
    name: 'upload-simple',
    type: 'post',
    path: '/upload-simple',
    middleware: [uploadSimple],
    action: uploadFile,
  },
]
