import * as multer from '@koa/multer'
import type { IRoute } from '.'
import {
  uploadFiles,
  uploadFile,
  readFiles,
} from '../controllerPublic/file-controller'

const upload = multer()

const uploadMultiple = upload.array('files', 10)

const uploadSimple = upload.single('file')

const uploadList: IRoute[] = [
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
  {
    name: 'upload',
    type: 'get',
    path: '/source/:type/:filename',
    middleware: [],
    action: readFiles,
  },
]

export default uploadList
