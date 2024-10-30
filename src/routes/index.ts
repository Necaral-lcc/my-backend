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

const setRoutes = (list: IRoute[], prefix: string = ''): IRoute[] =>
  list.reduce((acc, cur) => {
    const { name, path, routes, type, action, middleware } = cur
    const fullPath = prefix + path
    if (routes) {
      acc.push(...setRoutes(routes, fullPath))
    } else {
      acc.push({
        name: name || path,
        path: fullPath,
        type,
        middleware: middleware || [],
        action,
      })
    }
    return acc
  }, [] as IRoute[])

export default setRoutes([...adminList, ...appList, ...uploadList])
