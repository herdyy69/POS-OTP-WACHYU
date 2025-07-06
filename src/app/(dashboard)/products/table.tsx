'use client'
import { toast } from '@/components/ui/alert/toast'
import { DeleteConfirmation } from '@/components/ui/dialog/deleteConfirmation'
import Cell from '@/components/ui/table/cells'
import DataTable from '@/components/ui/table/dataTable'
import { useRouter } from 'next/navigation'
import React from 'react'
import { productsDelete } from '../../../../_server/service/products_service'

export const TableProducts = ({ data }: { data: any }) => {
  const router = useRouter()

  const onDelete = async (guid: string) => {
    try {
      await productsDelete(guid).then(() => {
        toast.success({
          title: 'Success',
          body: 'Berhasil menghapus produk',
        })
        router.refresh()
      })
    } catch (error) {
      if (error instanceof Error) {
        const validationErrors = JSON.parse(error.message)

        toast.error({
          title: 'Error',
          body: validationErrors[0].message || 'Failed to delete product',
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

  const columns = [
    {
      header: 'Nama Produk',
      accessorKey: 'name',
      enableSorting: true,
      size: 150,
      cell: ({ row }: any) => (
        <div className='max-w-[120px] truncate text-xs sm:max-w-none sm:text-sm'>{row.original.name}</div>
      ),
    },
    {
      header: 'Deskripsi',
      accessorKey: 'description',
      enableSorting: false,
      size: 200,
      show: false, // Hide on mobile
      cell: ({ row }: any) => (
        <div className='max-w-[150px] truncate text-xs sm:text-sm' title={row.original.description}>
          {row.original.description || '-'}
        </div>
      ),
    },
    {
      header: 'Harga Asli',
      accessorKey: 'originalPrice',
      enableSorting: true,
      size: 120,
      cell: ({ row }: any) => <div className='text-xs sm:text-sm'>{formatCurrency(row.original.originalPrice)}</div>,
    },
    {
      header: 'Margin (%)',
      accessorKey: 'profitMarginPercentage',
      enableSorting: true,
      size: 100,
      show: false, // Hide on mobile
      cell: ({ row }: any) => (
        <div className='text-center text-xs sm:text-sm'>{row.original.profitMarginPercentage}%</div>
      ),
    },
    {
      id: 'action',
      header: '',
      cell: ({ row }: any) => (
        <div className='flex justify-end gap-1 sm:gap-2'>
          <Cell.Action>
            <Cell.Action.Item text='Edit' iconType='edit' href={`/products/${row.original.guid}`} />
            <DeleteConfirmation
              trigger={<Cell.Action.Item text='Hapus' iconType='delete' />}
              title='Hapus Produk'
              description='Apakah Anda yakin ingin menghapus produk ini?'
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

  return <DataTable dataQuery={data} columns={columns} isServerSide={true} emptyText='produk' />
}
