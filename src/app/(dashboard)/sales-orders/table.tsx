'use client'
import { toast } from '@/components/ui/alert/toast'
import { DeleteConfirmation } from '@/components/ui/dialog/deleteConfirmation'
import Cell from '@/components/ui/table/cells'
import DataTable from '@/components/ui/table/dataTable'
import { useRouter } from 'next/navigation'
import React from 'react'
import { salesOrdersDelete } from '../../../../_server/service/sales-orders_service'

export const TableSalesOrders = ({ data }: { data: any }) => {
  const router = useRouter()

  const onDelete = async (guid: string) => {
    try {
      await salesOrdersDelete(guid).then(() => {
        toast.success({
          title: 'Success',
          body: 'Berhasil menghapus pesanan',
        })
        router.refresh()
      })
    } catch (error) {
      if (error instanceof Error) {
        const validationErrors = JSON.parse(error.message)

        toast.error({
          title: 'Error',
          body: validationErrors[0].message || 'Failed to delete order',
        })
      }
    }
  }

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
      header: 'Toko',
      accessorKey: 'storeName',
      enableSorting: true,
      size: 150,
      cell: ({ row }: any) => (
        <div className='max-w-[120px] truncate text-xs sm:max-w-none sm:text-sm'>{row.original.storeName}</div>
      ),
    },
    {
      header: 'Tanggal',
      accessorKey: 'orderDate',
      enableSorting: true,
      size: 100,
      cell: ({ row }: any) => <div className='text-xs sm:text-sm'>{formatDate(row.original.orderDate)}</div>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      enableSorting: true,
      size: 100,
      cell: ({ row }: any) => getStatusBadge(row.original.status),
    },
    {
      header: 'Jumlah Item',
      accessorKey: 'totalItems',
      enableSorting: false,
      size: 100,
      show: false, // Hide on mobile
      cell: ({ row }: any) => <div className='text-center text-xs sm:text-sm'>{row.original.totalItems}</div>,
    },
    {
      header: 'Total Harga',
      accessorKey: 'totalAmount',
      enableSorting: false,
      size: 120,
      cell: ({ row }: any) => <div className='text-xs sm:text-sm'>{formatCurrency(row.original.totalAmount)}</div>,
    },
    {
      id: 'action',
      header: '',
      cell: ({ row }: any) => (
        <div className='flex justify-end gap-1 sm:gap-2'>
          <Cell.Action>
            <Cell.Action.Item text='Detail' iconType='eye' href={`/sales-orders/${row.original.guid}`} />
            <Cell.Action.Item text='Edit' iconType='edit' href={`/sales-orders/${row.original.guid}/edit`} />
            <DeleteConfirmation
              trigger={<Cell.Action.Item text='Hapus' iconType='delete' />}
              title='Hapus Pesanan'
              description='Apakah Anda yakin ingin menghapus pesanan ini? Semua item dalam pesanan akan ikut terhapus.'
              onConfirm={() => {
                onDelete(row.original.guid)
              }}
            />
          </Cell.Action>
        </div>
      ),
      size: 150,
    },
  ]

  return <DataTable dataQuery={data} columns={columns} isServerSide={true} emptyText='pesanan' />
}
