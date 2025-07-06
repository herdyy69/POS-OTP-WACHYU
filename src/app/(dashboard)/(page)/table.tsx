'use client'

import Cell from '@/components/ui/table/cells'
import DataTable from '@/components/ui/table/dataTable'
import Link from 'next/link'

export const TransactionHistoryTable = ({ data }: { data: any }) => {
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value))
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }

    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusMap[status as keyof typeof statusMap]}`}>
        {status}
      </span>
    )
  }

  const columns = [
    {
      header: 'ID',
      accessorKey: 'id',
      enableSorting: false,
      size: 60,
      show: false, // Hide on mobile
    },
    {
      header: 'Toko',
      accessorKey: 'storeName',
      enableSorting: false,
      size: 150,
      cell: ({ row }: any) => <div className='max-w-[120px] truncate sm:max-w-none'>{row.original.storeName}</div>,
    },
    {
      header: 'Tanggal',
      accessorKey: 'orderDate',
      enableSorting: false,
      size: 100,
      cell: ({ row }: any) => <div className='text-xs sm:text-sm'>{formatDate(row.original.orderDate)}</div>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      enableSorting: false,
      size: 100,
      cell: ({ row }: any) => getStatusBadge(row.original.status),
    },
    {
      header: 'Item',
      accessorKey: 'totalItems',
      enableSorting: false,
      size: 60,
      cell: ({ row }: any) => <div className='text-center text-xs sm:text-sm'>{row.original.totalItems}</div>,
    },
    {
      header: 'Total',
      accessorKey: 'totalAmount',
      enableSorting: false,
      size: 120,
      cell: ({ row }: any) => <div className='text-xs sm:text-sm'>{formatCurrency(row.original.totalAmount)}</div>,
    },
    {
      header: 'Profit',
      accessorKey: 'totalProfit',
      enableSorting: false,
      size: 120,
      show: false, // Hide on mobile
      cell: ({ row }: any) => (
        <span className='text-xs font-medium text-green-600 sm:text-sm'>
          {formatCurrency(row.original.totalProfit)}
        </span>
      ),
    },
    {
      id: 'action',
      header: '',
      cell: ({ row }: any) => (
        <div className='flex justify-end gap-1 sm:gap-2'>
          <Link
            href={`/sales-orders/${row.original.id}`}
            className='rounded bg-blue-100 px-2 py-1 text-xs text-blue-600 hover:bg-blue-200 sm:px-3 sm:text-sm'
          >
            Detail
          </Link>
        </div>
      ),
      size: 80,
    },
  ]

  return <DataTable dataQuery={data} columns={columns} isServerSide={true} emptyText='transaksi' />
}
