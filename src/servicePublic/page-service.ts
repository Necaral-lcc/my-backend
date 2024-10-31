import { PageParams } from '@/serviceAdmin/type'
import { formatResponse } from '@/utils'
import { Context } from 'koa'

class PageService {
  isPage(ctx: Context): Promise<PageParams> {
    const { page, pageSize, ...other } = ctx.query

    return new Promise((resolve, reject) => {
      if (!(typeof page === 'string') || isNaN(Number(page))) {
        ctx.body = formatResponse(null, '请输入正确的页码')
        reject('请输入正确的页码')
      }
      if (!(typeof pageSize === 'string') || isNaN(Number(pageSize))) {
        ctx.body = formatResponse(null, '请输入正确的每页条数')
        reject('请输入正确的每页条数')
      }
      resolve({ page: Number(page), pageSize: Number(pageSize), ...other })
    })
  }
}

export default new PageService()
