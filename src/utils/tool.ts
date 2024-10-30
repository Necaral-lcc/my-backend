interface sList {
  id: number
  parentId: number | null
  [key: string]: any
}

interface sTree extends sList {
  children: sTree[]
}

export const listToTree = (ar: sList[], parentId: number | null) => {
  return ar
    .filter((item) => item.parentId === parentId)
    .map((item) => {
      const obj: sTree = {
        ...item,
        parentId: item.parentId || 0,
        children: listToTree(
          ar.filter((i) => i.parentId !== parentId),
          item.id
        ),
      }
      return obj
    })
}
