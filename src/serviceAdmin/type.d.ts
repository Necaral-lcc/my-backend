export interface IRequestBody {
  [key: string]: any
}

export interface PageParams {
  page: number
  pageSize: number
  orderBy?: 'asc' | 'desc'
  order?: string
  [key: string]: any
}
