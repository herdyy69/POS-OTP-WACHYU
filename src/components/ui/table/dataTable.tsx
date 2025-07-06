import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  PaginationState,
  RowSelectionState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'

import { TableProps } from '@/interfaces/table'
import { useUpdateParams } from '@/hooks/useUpdateParams'
import { useFilterTable } from '@/hooks/useFilterTable'

import Table from '@/components/ui/table/core/table'
import TablePagination from '@/components/ui/table/core/tablePagination'
import TableDnD from './core/tableDnD'
import { UniqueIdentifier } from '@dnd-kit/core'

function DataTable<TData, TValue>({
  dataQuery,
  columns,
  isLoading,
  isServerSide = true,
  withPagination = true,
  name,
  filterKeys,
  onRowClick,
  isDraggable = false,
  className,
  onChangePosition,
  onChangeOrder,
  emptyText,
}: TableProps<TData, TValue> & {
  name?: string
  className?: string
  filterKeys?: string[]
  onChangePosition?: ({
    newIndex,
    oldIndex,
    dataIndex,
  }: {
    newIndex?: number
    oldIndex?: number
    dataIndex?: any
  }) => void
  onChangeOrder?: (orderData: any[]) => void
  emptyText?: string
}) {
  const { filter } = useFilterTable({
    name,
    filterKeys,
  })
  const searchParams = useSearchParams()
  const updateParams = useUpdateParams()
  const page = searchParams.get('page')
  const limit = searchParams.get('limit')

  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: isServerSide ? filter?.page - 1 : (filter?.page ?? 0),
    pageSize: isServerSide ? filter?.limit : (filter?.limit ?? 10),
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  )

  const handleGoToPage = (page: number) => {
    const paramsToUpdate: { [key: string]: string } = {}
    const pageKey = name ? `page_${name}` : 'page'

    if (isServerSide) {
      paramsToUpdate[pageKey] = String(page + 1)
    } else {
      paramsToUpdate.page = String(page + 1)
    }

    updateParams(paramsToUpdate)
    setPagination({ ...pagination, pageIndex: page })
  }

  const handleSetPageRows = (limit: number) => {
    const paramsToUpdate: { [key: string]: string } = {}
    const pageKey = name ? `page_${name}` : 'page'
    const limitKey = name ? `limit_${name}` : 'limit'

    if (isServerSide) {
      paramsToUpdate[pageKey] = '1'
      paramsToUpdate[limitKey] = String(limit)
    } else {
      paramsToUpdate.page = '1'
      paramsToUpdate.limit = String(limit)
    }

    updateParams(paramsToUpdate)
    setPagination({ ...pagination, pageSize: limit, pageIndex: 0 })
  }

  const handleSort = (id: string) => {
    const isSortName = !!name
    const sortKey = isSortName ? `sort_${name}` : 'sort'
    const orderKey = isSortName ? `order_${name}` : 'order'
    const pageKey = isSortName ? `page_${name}` : 'page'

    if (sorting[0]?.id === id) {
      if (sorting[0]?.desc === true) {
        updateParams({ [orderKey]: id, [sortKey]: 'ASC', [pageKey]: '1' })
        setSorting([{ id, desc: false }])
      } else {
        updateParams({ [orderKey]: id, [sortKey]: 'DESC', [pageKey]: '1' })
        setSorting([{ id, desc: true }])
      }
    } else {
      updateParams({ [orderKey]: id, [sortKey]: 'DESC', [pageKey]: '1' })
      setSorting([{ id, desc: true }])
    }
  }

  useEffect(() => {
    if (!isServerSide) {
      setPagination({
        pageIndex: page ? parseInt(page as string, 10) - 1 : 0,
        pageSize: limit ? parseInt(limit as string, 10) : 10,
      })
    } else {
      setPagination({
        pageIndex: filter?.page ? filter.page - 1 : 0,
        pageSize: filter?.limit || 10,
      })

      if (filter?.sort) {
        setSorting([
          {
            id: filter.order,
            desc: filter.sort === 'DESC',
          },
        ])
      }
    }
  }, [filter, isServerSide, page, limit])

  // ======================= Drag and Drop ==============================
  const [initialData, setInitialData] = useState<any[]>([])
  const dataIds = useMemo<UniqueIdentifier[]>(() => initialData.map(({ id }) => id), [initialData])

  // ======================= TABLE ==============================
  const DATA = useMemo(() => {
    return dataQuery?.data || []
  }, [dataQuery])

  const table = useReactTable({
    data: DATA || [],
    columns: columns,

    // Core row model
    getCoreRowModel: getCoreRowModel(),

    // Sorting configuration
    manualSorting: isServerSide,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    // Row selection configuration
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),

    // Pagination configuration
    manualPagination: isServerSide,
    onPaginationChange: setPagination,
    getPaginationRowModel: withPagination ? getPaginationRowModel() : undefined,
    rowCount: isServerSide
      ? (dataQuery?.paginate?.total_data ?? (isDraggable ? initialData.length : DATA.length))
      : isDraggable
        ? initialData.length
        : DATA.length,
    pageCount: isServerSide
      ? (dataQuery?.paginate?.total_page ?? -1)
      : Math.ceil((isDraggable ? initialData.length : DATA.length) / pagination.pageSize),

    // Column resizing configuration
    columnResizeMode: 'onChange',
    enableColumnResizing: true,

    // State management
    state: {
      sorting,
      pagination,
      rowSelection,
    },

    // Default column properties
    defaultColumn: {
      size: 200,
      minSize: 50,
      maxSize: 2000,
    },
  })

  useEffect(() => {
    if (dataQuery?.data) setInitialData(dataQuery.data ?? [])
  }, [dataQuery?.data])

  if (isDraggable) {
    table.setOptions((prev) => ({
      ...prev, //preserve any other options that we have set up above
      data: initialData,
      getRowId: (row: any) => row.id,
    }))

    onChangeOrder && onChangeOrder(initialData)
  }

  return (
    <div className={cn('overflow-hidden rounded-2xl', className)}>
      {isDraggable ? (
        <TableDnD
          table={table}
          isLoading={isLoading}
          handleSort={handleSort}
          isServerSide={isServerSide}
          dataIds={dataIds}
          onChangeData={setInitialData}
          onChangePosition={onChangePosition}
        />
      ) : (
        <Table
          table={table}
          isLoading={isLoading}
          handleSort={handleSort}
          isServerSide={isServerSide}
          onRowClick={onRowClick}
          emptyText={emptyText}
        />
      )}

      {withPagination && (
        <TablePagination
          table={table}
          isLoading={isLoading}
          handleGoToPage={handleGoToPage}
          handleSetPageRows={handleSetPageRows}
          isServerSide={isServerSide}
        />
      )}
    </div>
  )
}

export default DataTable
