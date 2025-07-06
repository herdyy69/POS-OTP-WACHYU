'use client'
import { toast } from '@/components/ui/alert/toast'
import { DeleteConfirmation } from '@/components/ui/dialog/deleteConfirmation'
import Cell from '@/components/ui/table/cells'
import DataTable from '@/components/ui/table/dataTable'
import { useRouter } from 'next/navigation'
import React from 'react'
import { peopleDelete } from '../../../../_server/service/poeple_service'

export const TablePeople = ({ data }: { data: any }) => {
  const router = useRouter()

  const onDelete = async (guid: string) => {
    try {
      await peopleDelete(guid).then(() => {
        toast.success({
          title: 'Success',
          body: 'Berhasil menghapus orang',
        })
        router.refresh()
      })
    } catch (error) {
      if (error instanceof Error) {
        const validationErrors = JSON.parse(error.message)

        toast.error({
          title: 'Error',
          body: validationErrors[0].message || 'Failed to create class',
        })
      }
    }
  }

  const columns = [
    {
      header: 'ID',
      accessorKey: 'guid',
      enableSorting: true,
      size: 150,
      show: false, // Hide on mobile
    },
    {
      header: 'First Name',
      accessorKey: 'first_name',
      enableSorting: true,
      size: 150,
      cell: ({ row }: any) => (
        <div className='max-w-[120px] truncate text-xs sm:max-w-none sm:text-sm'>{row.original.first_name}</div>
      ),
    },
    {
      header: 'Last Name',
      accessorKey: 'last_name',
      enableSorting: true,
      size: 150,
      cell: ({ row }: any) => (
        <div className='max-w-[120px] truncate text-xs sm:max-w-none sm:text-sm'>{row.original.last_name}</div>
      ),
    },
    {
      header: 'Email',
      accessorKey: 'email',
      enableSorting: true,
      size: 200,
      show: false, // Hide on mobile
      cell: ({ row }: any) => <div className='max-w-[150px] truncate text-xs sm:text-sm'>{row.original.email}</div>,
    },
    {
      id: 'action',
      header: '',
      cell: ({ row }: any) => (
        <div className='flex justify-end gap-1 sm:gap-2'>
          <Cell.Action>
            <Cell.Action.Item text='Edit' iconType='edit' href={`/people/${row.original.guid}`} />
            <DeleteConfirmation
              trigger={<Cell.Action.Item text='Hapus' iconType='delete' />}
              title='Hapus Orang'
              description='Apakah Anda yakin ingin menghapus orang ini?'
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

  return <DataTable dataQuery={data} columns={columns} isServerSide={true} emptyText='orang' />
}
