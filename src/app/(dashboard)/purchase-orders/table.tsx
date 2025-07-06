'use client'
import { toast } from '@/components/ui/alert/toast'
import { DeleteConfirmation } from '@/components/ui/dialog/deleteConfirmation'
import Cell from '@/components/ui/table/cells'
import DataTable from '@/components/ui/table/dataTable'
import { useRouter } from 'next/navigation'
import React from 'react'
import { purchaseOrderDelete } from '../../../../_server/service/purchase-orders_service'

export const TablePurchaseOrders = ({ data }: { data: any }) => {
  const router = useRouter()

  const onDelete = async (guid: string) => {
    try {
      await purchaseOrderDelete(guid).then(() => {
        toast.success({
          title: 'Berhasil',
          body: 'Berhasil menghapus pesanan pembelian',
        })
        router.refresh()
      })
    } catch (error) {
      if (error instanceof Error) {
        const validationErrors = JSON.parse(error.message)

        toast.error({
          title: 'Error',
          body: validationErrors[0].message || 'Gagal menghapus pesanan pembelian',
        })
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Draft', className: 'bg-yellow-100 text-yellow-800' },
      submitted: { label: 'Dikirim', className: 'bg-blue-100 text-blue-800' },
      received: { label: 'Diterima', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-800' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const columns = [
    {
      header: 'Nomor Pesanan',
      accessorKey: 'orderNumber',
      enableSorting: true,
      size: 150,
      cell: ({ row }: any) => (
        <div className='max-w-[120px] truncate text-xs font-medium sm:max-w-none sm:text-sm'>
          {row.original.orderNumber}
        </div>
      ),
    },
    {
      header: 'Tanggal Pesanan',
      accessorKey: 'orderDate',
      enableSorting: true,
      size: 120,
      cell: ({ row }: any) => (
        <div className='text-xs sm:text-sm'>{new Date(row.original.orderDate).toLocaleDateString('id-ID')}</div>
      ),
    },
    {
      header: 'Tanggal Pengiriman',
      accessorKey: 'deliveryDate',
      enableSorting: true,
      size: 120,
      show: false, // Hide on mobile
      cell: ({ row }: any) => (
        <div className='text-xs sm:text-sm'>
          {row.original.deliveryDate ? new Date(row.original.deliveryDate).toLocaleDateString('id-ID') : '-'}
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      enableSorting: true,
      size: 100,
      cell: ({ row }: any) => getStatusBadge(row.original.status),
    },
    {
      header: 'Total Jumlah',
      accessorKey: 'totalAmount',
      enableSorting: true,
      size: 120,
      cell: ({ row }: any) => (
        <div className='text-xs font-medium sm:text-sm'>
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(Number(row.original.totalAmount))}
        </div>
      ),
    },
    {
      header: 'Total Item',
      accessorKey: 'totalItems',
      enableSorting: false,
      size: 100,
      show: false, // Hide on mobile
      cell: ({ row }: any) => <div className='text-xs sm:text-sm'>{row.original.totalItems || 0}</div>,
    },
    {
      header: 'Catatan',
      accessorKey: 'notes',
      enableSorting: false,
      size: 150,
      show: false, // Hide on mobile
      cell: ({ row }: any) => (
        <div className='max-w-[120px] truncate text-xs sm:text-sm' title={row.original.notes}>
          {row.original.notes || '-'}
        </div>
      ),
    },
    {
      id: 'action',
      header: '',
      cell: ({ row }: any) => (
        <div className='flex justify-end gap-1 sm:gap-2'>
          <Cell.Action>
            <Cell.Action.Item text='Lihat' iconType='view' href={`/purchase-orders/${row.original.guid}`} />
            <Cell.Action.Item text='Edit' iconType='edit' href={`/purchase-orders/${row.original.guid}/edit`} />
            <DeleteConfirmation
              trigger={<Cell.Action.Item text='Hapus' iconType='delete' />}
              title='Hapus Pesanan Pembelian'
              description='Apakah Anda yakin ingin menghapus pesanan pembelian ini?'
              onConfirm={() => {
                onDelete(row.original.guid)
              }}
            />
          </Cell.Action>
        </div>
      ),
      size: 120,
    },
  ]

  return <DataTable dataQuery={data} columns={columns} isServerSide={true} emptyText='pesanan pembelian' />
}
