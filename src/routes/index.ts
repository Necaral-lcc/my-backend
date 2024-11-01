import type { Context, Middleware } from 'koa'
import adminList from './adminList'
import appList from './appList'
import uploadList from './upload'

export interface IRoute {
  name?: string
  path: string
  routes?: IRoute[]
  type?: string
  middleware?: Middleware[]
  action?: (ctx: Context) => Promise<void | Context>
}
/**
 * 设置路由
 * @description 遍历路由列表，设置路由信息，包括路由名称、路径、中间件、类型、动作
 * @param list 路由列表
 * @param prefix 路由前缀
 * @param mid 路由中间件
 * @returns  路由列表
 */
const setRoutes = (
  list: IRoute[],
  prefix: string = '',
  mid: Middleware[] = []
): IRoute[] =>
  list.reduce((acc, cur) => {
    const { name, path, routes, type, action, middleware = [] } = cur
    const fullPath = prefix + path
    const middlewareList = [...mid, ...middleware]
    if (routes) {
      acc.push(...setRoutes(routes, fullPath, middlewareList))
    } else {
      acc.push({
        name: name || path,
        path: fullPath,
        type,
        middleware: middlewareList,
        action,
      })
    }
    return acc
  }, [] as IRoute[])

export default setRoutes([...adminList, ...appList, ...uploadList])
