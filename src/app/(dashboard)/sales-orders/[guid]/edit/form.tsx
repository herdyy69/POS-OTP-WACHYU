'use client'

import { toast } from '@/components/ui/alert/toast'
import Form from '@/components/ui/form'
import { InsertSalesOrders, SalesOrders } from '@/schemas/sales-orders'
import { salesOrdersUpdate } from '@/service/sales-orders_service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface Store {
  guid: string
  name: string
}

export const FormUpdate = ({ data, stores }: { data: SalesOrders; stores: Store[] }) => {
  const router = useRouter()

  const form = useForm<InsertSalesOrders>({
    defaultValues: {
      orderDate: '',
      notes: '',
    },
    resolver: zodResolver(InsertSalesOrders),
  })

  useEffect(() => {
    if (data) {
      form.reset({
        storeGuid: data.storeGuid,
        orderDate: new Date(data.orderDate).toISOString().split('T')[0],
        status: data.status,
        notes: data.notes || '',
      })
    }
  }, [data, form])

  const onSave = async (formData: InsertSalesOrders) => {
    try {
      await salesOrdersUpdate(data.guid, formData).then(() => {
        toast.success({
          title: 'Success',
          body: 'Berhasil memperbarui pesanan',
        })
        router.push(`/sales-orders/${data.guid}`)
      })
    } catch (error) {
      if (error instanceof Error) {
        const validationErrors = JSON.parse(error.message)
        toast.error({
          title: 'Error',
          body: validationErrors[0].message || 'Failed to update order',
        })
      }
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className='card space-y-6'>
      <div className='space-y-1'>
        <h1 className='plabs-title-medium-20 text-greyscale-9'>Edit Pesanan #{data.guid}</h1>
        <p className='plabs-body-regular-14 text-greyscale-6'>
          Edit informasi pesanan. Tanggal dibuat: {formatDate(data.createdAt?.toString() || '')}
        </p>
      </div>

      <div className='bg-primary-background plabs-title-medium-16 text-primary-base w-full rounded-2xl px-3 py-2.5'>
        Data Pesanan
      </div>

      <Form id='update_order' form={form} onSave={onSave} className='space-y-6'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='space-y-4'>
            <div>
              <label className='plabs-title-medium-14 text-greyscale-7 mb-2 block'>Toko *</label>
              <Form.Select
                name='storeGuid'
                placeholder='Pilih toko'
                options={stores.map((store) => ({
                  value: store.guid,
                  label: store.name,
                }))}
                defaultValue={data.storeGuid}
              />
            </div>

            <div>
              <label className='plabs-title-medium-14 text-greyscale-7 mb-2 block'>Tanggal Order *</label>
              <Form.Input name='orderDate' type='date' />
            </div>
          </div>

          <div className='space-y-4'>
            <div>
              <label className='plabs-title-medium-14 text-greyscale-7 mb-2 block'>Status</label>
              <Form.Select
                name='status'
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'processing', label: 'Processing' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
                defaultValue={data.status}
              />
            </div>

            <div>
              <label className='plabs-title-medium-14 text-greyscale-7 mb-2 block'>Catatan</label>
              <Form.Textarea name='notes' placeholder='Masukkan catatan (opsional)' />
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-2'>
          <Form.Button type='button' onClick={() => router.back()} className='btn-outline-greyscale'>
            Batal
          </Form.Button>
          <Form.Button type='submit' className='btn-green'>
            Perbarui Pesanan
          </Form.Button>
        </div>
      </Form>
    </div>
  )
}
