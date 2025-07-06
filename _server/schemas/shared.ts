import { z } from 'zod'

interface Message {
  id: string
  en: string
}

interface Pagination {
  current_page: number
  per_page: number
  total_page: number
  total_data: number
}

interface BaseResponse<T> {
  message: Message
  data: T
}

interface BaseTableResponse<T> {
  message?: any
  data: T[]
  paginate: Pagination
}

const Generated = z.object({
  id: z.number().optional(),
  created_at: z.string().optional(),
  created_by: z.string().optional().or(z.number().optional()),
  updated_at: z.string().optional(),
  updated_by: z.string().optional().or(z.number().optional()),
})

const NumberSchema = (message?: string) =>
  z
    .union([z.string().optional(), z.number().optional()])
    .refine(
      (val) => {
        if (message) {
          return !!val
        } else {
          return true
        }
      },
      { message },
    )
    .transform((val) => (!!val ? +val : ''))

export { Generated, NumberSchema, type BaseResponse, type BaseTableResponse }
