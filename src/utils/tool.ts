interface sList {
  id: number
  parentId: number | null
}

type ITree<T extends Object> = T & {
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
