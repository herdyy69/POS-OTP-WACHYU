import { NextRequest } from 'next/server'
import { JsonResponse, Paginate, SearchParams } from '../schemas/api'

export function parseSearchParams(request: NextRequest): SearchParams {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search') || ''
  const page = searchParams.get('page') || '1'
  const limit = searchParams.get('limit') || '10'
  const order = searchParams.get('order_by') as string | undefined
  const sort = (searchParams.get('sort') as 'asc' | 'desc') || 'asc'

  return {
    search,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    order,
    sort,
  }
}

export function createPagination(totalData: number, pageNumber: number, limitNumber: number): Paginate {
  return {
    total_data: totalData,
    current_page: pageNumber,
    per_page: limitNumber,
    total_page: Math.ceil(totalData / limitNumber),
  }
}

export function createResponse(
  status: number,
  {
    data,
    error,
    message,
    paginate,
    headers: headers = {
      'Content-Type': 'application/json',
    },
  }: JsonResponse,
): Response {
  return new Response(
    JSON.stringify({
      data,
      error,
      message,
      paginate,
    }),
    {
      status,
      headers,
    },
  )
}
