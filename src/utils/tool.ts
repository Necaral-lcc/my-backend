export interface sList {
  id: number
  parentId: number | null
}

export type ITree<T extends Object> = T & {
  children: ITree<T>[]
}
/**
 * 将列表转化为树结构
 * @param ar  列表
 * @param parentId   父节点id
 * @returns 树结构
 */
export const listToTree = <T extends sList>(
  ar: T[],
  parentId: number | null
) => {
  return ar
    .filter((item) => item.parentId === parentId)
    .map((item) => {
      const obj: ITree<T> = {
        ...item, // 继承父节点的属性
        parentId: item.parentId || 0, // 根节点的parentId为null，需要转换为0
        children: listToTree(
          ar.filter((i) => i.parentId !== parentId), // 过滤掉父节点的子节点
          item.id // 父节点的id作为子节点的父节点id
        ),
      }
      return obj
    })
}

type vPromiseFunc<T extends sList> = (id: number | null) => Promise<T[]>

/**
 * 树结构深度遍历 promise
 * @param list  列表
 * @param promiseFunc 异步函数
 * @returns {Promise<ITree<T>[]>} 树结构
 */
export const deepListToTree = async <T extends sList>(
  list: Array<T>,
  promiseFunc: vPromiseFunc<T>
) => {
  const result = await Promise.all(
    list.map(async (l) => {
      const res = await promiseFunc(l.id)
      const d: ITree<T> = {
        ...l,
        parentId: l.parentId || 0,
        children: [],
      }
      if (res.length) {
        d.children = await deepListToTree<T>(res, promiseFunc)
      }
      return d
    })
  )
  return result
}
