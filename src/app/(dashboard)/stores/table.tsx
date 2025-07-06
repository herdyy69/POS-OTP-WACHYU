'use client'
import { toast } from '@/components/ui/alert/toast'
import { DeleteConfirmation } from '@/components/ui/dialog/deleteConfirmation'
import Cell from '@/components/ui/table/cells'
import DataTable from '@/components/ui/table/dataTable'
import { useRouter } from 'next/navigation'
import React from 'react'
import { storesDelete } from '../../../../_server/service/stores_service'

export const TableStores = ({ data }: { data: any }) => {
  const router = useRouter()

  const onDelete = async (guid: string) => {
    try {
      await storesDelete(guid).then(() => {
        toast.success({
          title: 'Success',
          body: 'Berhasil menghapus toko',
        })
        router.refresh()
      })
    } catch (error) {
      if (error instanceof Error) {
        const validationErrors = JSON.parse(error.message)

        toast.error({
          title: 'Error',
          body: validationErrors[0].message || 'Failed to delete store',
        })
      }
    }
  }

  const columns = [
    {
      header: 'Nama Toko',
      accessorKey: 'name',
      enableSorting: true,
      size: 150,
      cell: ({ row }: any) => (
        <div className='max-w-[120px] truncate text-xs sm:max-w-none sm:text-sm'>{row.original.name}</div>
      ),
    },
    {
      header: 'Pemilik',
      accessorKey: 'ownerName',
      enableSorting: true,
      size: 150,
      show: false, // Hide on mobile
      cell: ({ row }: any) => <div className='max-w-[120px] truncate text-xs sm:text-sm'>{row.original.ownerName}</div>,
    },
    {
      header: 'Alamat',
      accessorKey: 'fullAddress',
      enableSorting: false,
      size: 200,
      show: false, // Hide on mobile
      cell: ({ row }: any) => (
        <div className='max-w-[150px] truncate text-xs sm:text-sm' title={row.original.fullAddress}>
          {row.original.fullAddress}
        </div>
      ),
    },
    {
      header: 'No. Telepon',
      accessorKey: 'phoneNumber',
      enableSorting: false,
      size: 120,
      cell: ({ row }: any) => <div className='text-xs sm:text-sm'>{row.original.phoneNumber}</div>,
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
            <Cell.Action.Item text='Edit' iconType='edit' href={`/stores/${row.original.guid}`} />
            <DeleteConfirmation
              trigger={<Cell.Action.Item text='Hapus' iconType='delete' />}
              title='Hapus Toko'
              description='Apakah Anda yakin ingin menghapus toko ini?'
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

  return <DataTable dataQuery={data} columns={columns} isServerSide={true} emptyText='toko' />
}
