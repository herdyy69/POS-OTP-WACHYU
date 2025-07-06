import { ColumnDef, Row } from '@tanstack/react-table'
import { BaseTableResponse } from '../../_server/schemas/shared'

export interface TableProps<TData, TValue> {
  isLoading?: boolean
  dataQuery?: UseGetTableResponseType<TData> | BaseTableResponse<TData>
  columns: ColumnDef<TData, TValue>[]
  filter?: any
  setFilter?: any
  isServerSide?: boolean
  withPagination?: boolean
  onRowClick?: (row: Row<TData>) => void
  isDraggable?: boolean
}

export interface UseGetTableResponseType<TData> {
  paginate?: {
    per_page: number
    current_page: number
    total_data: number
    total_page: number
  }
  data: TData[]
}

export interface filterTableProps {
  name?: string
  defaultFilter?: {
    name?: string
    page?: number
    limit?: number
    sort?: string
    order?: 'asc' | 'desc'
    search?: string
  }
}

export interface SelectionTableProps<TData, TValue> {
  dataQuery?: UseGetTableResponseType<TData>
  columns: ColumnDef<TData, TValue>[]
  filter: any
  setFilter: any
  isLoading?: boolean
}
