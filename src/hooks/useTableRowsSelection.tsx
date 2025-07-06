import { Row, Table } from '@tanstack/react-table'
import React, { useCallback, useEffect, useState } from 'react'

export function useTableRowsSelection<T>() {
  const [selectedRows, setSelectedRows] = useState<T[]>([])

  const onRowSelectionChange = useCallback(
    (row: Row<T>) => (event: React.ChangeEvent<HTMLInputElement>) => {
      row.getToggleSelectedHandler()(event)
      if (!row.getIsSelected()) {
        setSelectedRows((prev) => [...prev, row.original])
      } else {
        setSelectedRows((prev) => prev.filter((item) => item !== row.original))
      }
    },
    [],
  )

  const onAllRowsSelectionChange = useCallback(
    (table: Table<T>) => (event: React.ChangeEvent<HTMLInputElement>) => {
      table.getToggleAllRowsSelectedHandler()(event)
      if (!table?.getIsAllRowsSelected()) {
        const selectedRows = table?.getSortedRowModel().rows

        const selectedData = selectedRows.map((row: any) => {
          return row.original
        })

        setSelectedRows(selectedData)
      } else {
        setSelectedRows([])
      }
    },
    [],
  )
  const onAllPagesSelectionChange = useCallback(
    (table: Table<T>) => (event: React.ChangeEvent<HTMLInputElement>) => {
      table.getToggleAllPageRowsSelectedHandler()(event)
      if (!table.getIsAllPageRowsSelected()) {
        const selectedRows = table.getRowModel().rows

        const selectedData = selectedRows.map((row: any) => {
          return row.original
        })

        setSelectedRows(selectedData)
      } else {
        setSelectedRows([])
      }
    },
    [],
  )

  const onResetRowsSelection = (table: Table<T>) => {
    setSelectedRows([])
    table.getSelectedRowModel().rows.forEach((row) => {
      row.toggleSelected(false)
    })
  }

  return {
    selectedRows,
    onRowSelectionChange,
    onAllRowsSelectionChange,
    onAllPagesSelectionChange,
    onResetRowsSelection,
  }
}
