'use client'

import Form from '@/components/ui/form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const FilterSchema = z.object({
  storeGuid: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

type FilterData = z.infer<typeof FilterSchema>

interface Store {
  guid: string
  name: string
}

export const TransactionFilters = ({ stores }: { stores: Store[] }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<FilterData>({
    defaultValues: {
      storeGuid: searchParams.get('storeGuid') || undefined,
      status: searchParams.get('status') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
    },
    resolver: zodResolver(FilterSchema),
  })

  const applyFilters = (data: FilterData) => {
    const params = new URLSearchParams()

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    form.reset({
      storeGuid: undefined,
      status: undefined,
      startDate: undefined,
      endDate: undefined,
    })
    router.push('/')
  }

  return (
    <div className='card space-y-4'>
      <h3 className='plabs-title-medium-14 text-greyscale-9 sm:plabs-title-medium-16'>Filter Transaksi</h3>

      <Form form={form} onSave={applyFilters} id='filter-form'>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='space-y-2'>
            <label className='plabs-body-regular-10 text-greyscale-6 sm:plabs-body-regular-12'>Toko</label>
            <Form.Select
              name='storeGuid'
              placeholder='Semua Toko'
              options={stores.map((store) => ({
                value: store.guid,
                label: store.name,
              }))}
            />
          </div>

          <div className='space-y-2'>
            <label className='plabs-body-regular-10 text-greyscale-6 sm:plabs-body-regular-12'>Status</label>
            <Form.Select
              name='status'
              placeholder='Semua Status'
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'processing', label: 'Processing' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
            />
          </div>

          <div className='space-y-2'>
            <label className='plabs-body-regular-10 text-greyscale-6 sm:plabs-body-regular-12'>Tanggal Mulai</label>
            <Form.Input name='startDate' type='date' />
          </div>

          <div className='space-y-2'>
            <label className='plabs-body-regular-10 text-greyscale-6 sm:plabs-body-regular-12'>Tanggal Selesai</label>
            <Form.Input name='endDate' type='date' />
          </div>
        </div>

        <div className='flex flex-col gap-2 sm:flex-row sm:gap-2'>
          <Form.Button type='submit' className='btn-green text-xs sm:text-sm'>
            Terapkan Filter
          </Form.Button>
          <Form.Button type='button' onClick={clearFilters} className='btn-outline-greyscale text-xs sm:text-sm'>
            Reset Filter
          </Form.Button>
        </div>
      </Form>
    </div>
  )
}
