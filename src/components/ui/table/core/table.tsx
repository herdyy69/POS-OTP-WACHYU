import { Header, Row, Table as TableType, flexRender } from '@tanstack/react-table'
import {
  Table as TableContainer,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from '@/components/ui/table/core'
import { cn } from '@/lib/utils'
import { Icons } from '../../icons'

interface TableProps<TData> {
  table: TableType<TData>
  isLoading?: boolean
  handleSort: (id: string) => void
  isServerSide?: boolean
  onRowClick?: (row: Row<TData>) => void
  emptyText?: string
}

function Table<TData>({ table, isLoading, handleSort, isServerSide = true, onRowClick, emptyText }: TableProps<TData>) {
  const sortToggler = (header: Header<TData, unknown>, event: React.MouseEvent) => {
    if (!header.column.getCanSort()) return
    event.preventDefault()
    handleSort(header.column.id)
  }

  // Filter columns based on show property for responsive design
  const visibleColumns = table.getAllColumns().filter((column) => {
    const columnDef = column.columnDef as any
    return columnDef.show !== false
  })

  return (
    <TableContainer>
      <TableHeader>
        {table.getHeaderGroups().map((header) => (
          <TableRow key={header.id}>
            {header.headers
              .filter((header) => {
                const columnDef = header.column.columnDef as any
                return columnDef.show !== false
              })
              .map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{ position: 'relative', width: header.getSize() }}
                    className='bg-primary-background plabs-title-medium-12 text-greyscale-8'
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        onClick={(event) => sortToggler(header, event)}
                        className={`${
                          header.column.getCanSort() ? 'cursor-pointer' : ''
                        } flex items-center gap-1 select-none`}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' || header.column.getIsSorted() === 'desc' ? (
                          <div className='flex flex-col items-center justify-center'>
                            {header.column.getIsSorted() === 'asc' ? (
                              <Icons.SwapIcon
                                className={cn(
                                  'h-2.5 w-2.5',
                                  header.column.getIsSorted() === 'asc' ? 'text-greyscale-6' : 'text-greyscale-9',
                                )}
                              />
                            ) : (
                              <Icons.SwapIcon
                                className={cn(
                                  'h-2.5 w-2.5',
                                  header.column.getIsSorted() === 'desc' ? 'text-greyscale-6' : 'text-greyscale-9',
                                )}
                              />
                            )}
                          </div>
                        ) : null}
                      </div>
                    )}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                      ></div>
                    )}
                  </TableHead>
                )
              })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length === 0 && !isLoading ? (
          <TableEmpty totalColumns={visibleColumns.length} text={emptyText} />
        ) : !table.getRowModel().rows.length || isLoading ? (
          <TableSkeleton totalRow={table.getState().pagination.pageSize} totalColumns={visibleColumns.length} />
        ) : (
          table.getRowModel().rows.map((row, rowIndex) => (
            <TableRow key={row.id} className={rowIndex % 2 === 0 ? 'bg-greyscale-0' : 'bg-greyscale-1'}>
              {row
                .getVisibleCells()
                .filter((cell) => {
                  const columnDef = cell.column.columnDef as any
                  return columnDef.show !== false
                })
                .map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{ width: `${cell.column.columnDef.size}px` }}
                    className='plabs-caption-regular-12 text-greyscale-7 px-3 py-4 text-sm'
                    onClick={() => {
                      if (onRowClick) {
                        onRowClick(row)
                      }
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </TableContainer>
  )
}

export default Table
