import { Context } from 'koa'
import adminList from './adminList'
import appList from './appList'

interface IRoute {
  name?: string
  path: string
  routes?: IRoute[]
  type?: string
  action?: (ctx: Context) => Promise<void>
}

const setRoutes = (list: IRoute[], prefix: string = ''): IRoute[] =>
  list.reduce((acc, cur) => {
    const { name, path, routes, type, action } = cur
    const fullPath = prefix + path
    if (routes) {
      acc.push(...setRoutes(routes, fullPath))
    } else {
      acc.push({
        name: name || path,
        path: fullPath,
        type,
        action,
      })
    }
    return acc
  }, [])

export default setRoutes([...adminList, ...appList])
