'use client'

import { toast } from '@/components/ui/alert/toast'
import Form from '@/components/ui/form'
import { UpdatePurchaseOrder } from '@/../../_server/schemas/purchase-orders'
import { purchaseOrderUpdate } from '@/service/purchase-orders_service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Dikirim' },
  { value: 'received', label: 'Diterima' },
  { value: 'cancelled', label: 'Dibatalkan' },
]

export const FormUpdate = ({ data }: { data: any }) => {
  const router = useRouter()
  const form = useForm<UpdatePurchaseOrder>({
    defaultValues: {
      orderNumber: '',
      orderDate: '',
      deliveryDate: '',
      status: 'draft',
      totalAmount: '0',
      notes: '',
    },
    resolver: zodResolver(UpdatePurchaseOrder),
  })

  useEffect(() => {
    if (data) {
      form.reset({
        orderNumber: data.orderNumber,
        orderDate: data.orderDate ? new Date(data.orderDate).toISOString().split('T')[0] : '',
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate).toISOString().split('T')[0] : '',
        status: data.status as any,
        totalAmount: data.totalAmount,
        notes: data.notes || '',
      })
    }
  }, [data, form])

  const onSave = async (formData: UpdatePurchaseOrder) => {
    try {
      await purchaseOrderUpdate(data.guid, formData).then(() => {
        toast.success({
          title: 'Berhasil',
          body: 'Berhasil memperbarui pesanan pembelian',
        })
        router.push('/purchase-orders')
      })
    } catch (error) {
      if (error instanceof Error) {
        const validationErrors = JSON.parse(error.message)
        toast.error({
          title: 'Error',
          body: validationErrors[0].message || 'Gagal memperbarui pesanan pembelian',
        })
      }
    }
  }

  return (
    <div className='card space-y-6'>
      <div className='space-y-1'>
        <h1 className='plabs-title-medium-20 text-greyscale-9'>Form Perbarui Pesanan Pembelian</h1>
        <p className='plabs-body-regular-14 text-greyscale-6'>Perbarui pesanan pembelian Anda pada halaman ini.</p>
      </div>
      <div className='bg-primary-background plabs-title-medium-16 text-primary-base w-full rounded-2xl px-3 py-2.5'>
        Data Pesanan Pembelian
      </div>
      <Form id='update_purchase_order' form={form} onSave={onSave} className='space-y-2'>
        <div className='flex flex-col'>
          <div className='border-greyscale-4 border-b py-2 sm:py-6'>
            <div className='w-full space-y-8 sm:w-[80%]'>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Nomor Pesanan</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan nomor pesanan pembelian.</p>
                </div>
                <Form.Input name='orderNumber' placeholder='Masukkan nomor order' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Status</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Pilih status purchase order.</p>
                </div>
                <Form.Select name='status' options={statusOptions} placeholder='Pilih status' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Tanggal Pesanan</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Pilih tanggal pesanan.</p>
                </div>
                <Form.Input name='orderDate' type='date' placeholder='Pilih tanggal order' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Tanggal Pengiriman</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Pilih tanggal pengiriman (opsional).</p>
                </div>
                <Form.Input name='deliveryDate' type='date' placeholder='Pilih tanggal pengiriman' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Total Jumlah</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan total jumlah pesanan pembelian.</p>
                </div>
                <Form.Input name='totalAmount' type='number' placeholder='1000000' step='0.01' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Catatan</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan catatan tambahan (opsional).</p>
                </div>
                <Form.Textarea name='notes' placeholder='Masukkan catatan' />
              </div>
            </div>
          </div>
        </div>
        <div className='flex w-full justify-end gap-2'>
          <div className='flex gap-2'>
            <Form.Button onClick={() => router.back()} type='button' className='btn-outline-greyscale'>
              Batal
            </Form.Button>
            <Form.Button type='submit' className='btn-green'>
              Perbarui data pesanan pembelian
            </Form.Button>
          </div>
        </div>
      </Form>
    </div>
  )
}
