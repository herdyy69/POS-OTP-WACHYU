import { z } from 'zod'

const SearchParams = z.object({
  search: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(10),
  order: z.string().optional(),
  sort: z.string().optional(),
})

const Paginate = z.object({
  total_data: z.number(),
  current_page: z.number(),
  per_page: z.number(),
  total_page: z.number(),
})

const JsonResponse = z.object({
  data: z.any().optional(),
  error: z.any().optional(),
  message: z.string(),
  paginate: Paginate.optional(),
  headers: z.record(z.string()).optional(),
})

type SearchParams = z.infer<typeof SearchParams>
type Paginate = z.infer<typeof Paginate>
type JsonResponse = z.infer<typeof JsonResponse>

export { SearchParams, Paginate, JsonResponse }
