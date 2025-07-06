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
} from '.'
import { cn } from '@/lib/utils'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { CSSProperties, useEffect } from 'react'
import { Icons } from '../../icons'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface TableProps<TData> {
  table: TableType<TData>
  isLoading?: boolean
  handleSort: (id: string) => void
  isServerSide?: boolean
  onRowClick?: (row: Row<TData>) => void
  dataIds: any[]
  onChangeData: any
  onChangePosition?: ({
    newIndex,
    oldIndex,
    dataIndex,
  }: {
    newIndex?: number
    oldIndex?: number
    dataIndex?: any
  }) => void
}

const DraggableRow = ({ row }: { row: Row<any> }) => {
  const { attributes, listeners, transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.id,
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        'hover:bg-neutral-30 data-[state=selected]:bg-neutral-30 transition-colors',
        isDragging && 'opacity-50',
      )}
      {...attributes}
      {...listeners}
    >
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
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
    </TableRow>
  )
}

function TableDnD<TData>({
  table,
  isLoading,
  handleSort,
  isServerSide = true,
  dataIds,
  onChangeData,
  onChangePosition,
}: TableProps<TData>) {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = dataIds.indexOf(active.id)
      const newIndex = dataIds.indexOf(over!.id)

      const newData = arrayMove(dataIds, oldIndex, newIndex)
      onChangeData(newData)

      onChangePosition &&
        onChangePosition({
          newIndex,
          oldIndex,
          dataIndex: newData,
        })
    }
  }

  // Filter columns based on show property for responsive design
  const visibleColumns = table.getAllColumns().filter((column) => {
    const columnDef = column.columnDef as any
    return columnDef.show !== false
  })

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
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
                          onClick={(event) => {
                            if (!header.column.getCanSort()) return
                            event.preventDefault()
                            handleSort(header.column.id)
                          }}
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
            <TableEmpty totalColumns={visibleColumns.length} />
          ) : !table.getRowModel().rows.length || isLoading ? (
            <TableSkeleton totalRow={table.getState().pagination.pageSize} totalColumns={visibleColumns.length} />
          ) : (
            <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
              {table.getRowModel().rows.map((row) => (
                <DraggableRow key={row.id} row={row} />
              ))}
            </SortableContext>
          )}
        </TableBody>
      </TableContainer>
    </DndContext>
  )
}

export default TableDnD
