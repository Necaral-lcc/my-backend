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
import { SERVER_URL } from '../config'

interface sUploadFile {
  name: string
  filePath: string
}

const file_reg = /^([\s\S]*)\.(pdf|png|jpeg|jpg|docx|xlsx|pjpg|svg)$/

export const uploadFiles = async (ctx: Context) => {
  if (!ctx.files) {
    ctx.body = formatResponse(null, '上传失败，请选择文件')
    return
  }
  const files = ctx.files as multer.File[]
  try {
    const res = await Promise.all(
      files.map(async (file) => {
        const re = await uploadPromise(file)
        return re
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
      ctx.body = formatResponse(res, '上传成功')
    } else {
      ctx.body = formatResponse(null, '上传失败', 500)
    }
  } catch (err) {
    ctx.body = formatResponse(err, '上传失败', 500)
  }
}

const uploadPromise = (file: multer.File) => {
  return new Promise<sUploadFile>(async (resolve, reject) => {
    const filePath = path.join(
      __dirname,
      '../../uploads/files/',
      file.originalname
    )
    fs.writeFile(filePath, file.buffer, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve({
          name: file.originalname,
          filePath: getFilepath(file.originalname),
        })
      }
    })
  })
}

/**
 * 获取服务器文件访问路径
 * @param ctx
 */
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
    ctx.body = formatResponse(err, '文件不存在', 404)
  }
}

/**
 * 获取文件访问路径
 * @param filename
 * @returns
 */
export const getFilepath = (filename: string) => {
  return `${SERVER_URL}/source/files/${filename}`
}

function getExtensionFromMimeType(mimeType: string) {
  const extensionMap: Record<string, string> = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      'pptx',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'text/csv': 'csv',
    'text/plain': 'txt',
    'image/svg+xml': 'svg',
    'image/pjpeg': 'pjpg',
  }

  return extensionMap[mimeType] || null
}
