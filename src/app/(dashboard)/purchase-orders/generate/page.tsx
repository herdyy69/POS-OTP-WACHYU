'use client'

import { toast } from '@/components/ui/alert/toast'
import Form from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { generatePurchaseOrderFromSales } from '../../../../../_server/service/purchase-orders_service'

const GenerateSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  orderNumber: z.string().min(1, 'Order number is required'),
})

type GenerateData = z.infer<typeof GenerateSchema>

export default function GeneratePage() {
  const router = useRouter()

  const form = useForm<GenerateData>({
    defaultValues: {
      startDate: '',
      endDate: '',
      orderNumber: `PO-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    },
    resolver: zodResolver(GenerateSchema),
  })

  const onSave = async (data: GenerateData) => {
    try {
      await generatePurchaseOrderFromSales(data.startDate, data.endDate, data.orderNumber)

      toast.success({
        title: 'Berhasil',
        body: 'Pesanan pembelian berhasil dibuat dari pesanan penjualan',
      })

      router.push('/purchase-orders')
    } catch (error) {
      if (error instanceof Error) {
        toast.error({
          title: 'Error',
          body: error.message || 'Gagal membuat pesanan pembelian',
        })
      }
    }
  }

  return (
    <div className='card space-y-6'>
      <div className='space-y-1'>
        <h1 className='plabs-title-medium-20 text-greyscale-9'>Form Buat Pesanan Pembelian</h1>
        <p className='plabs-body-regular-14 text-greyscale-6'>
          Buat pesanan pembelian ke pusat berdasarkan pesanan penjualan dalam rentang tanggal tertentu.
        </p>
      </div>
      <div className='bg-primary-background plabs-title-medium-16 text-primary-base w-full rounded-2xl px-3 py-2.5'>
        Data Pesanan Pembelian
      </div>
      <Form id='generate_purchase_order' form={form} onSave={onSave} className='space-y-2'>
        <div className='flex flex-col'>
          <div className='border-greyscale-4 border-b py-2 sm:py-6'>
            <div className='w-full space-y-8 sm:w-[80%]'>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Tanggal Mulai</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Pilih tanggal mulai pesanan penjualan.</p>
                </div>
                <Form.Input name='startDate' type='date' placeholder='Pilih tanggal mulai' />
              </div>

              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Tanggal Akhir</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Pilih tanggal akhir pesanan penjualan.</p>
                </div>
                <Form.Input name='endDate' type='date' placeholder='Pilih tanggal akhir' />
              </div>

              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Nomor Pesanan</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>
                    Masukkan nomor pesanan untuk pesanan pembelian.
                  </p>
                </div>
                <Form.Input name='orderNumber' placeholder='Masukkan nomor order' />
              </div>
            </div>
          </div>
        </div>
        <div className='flex w-full justify-end gap-2'>
          <Form.Button onClick={() => router.back()} type='button' className='btn-outline-greyscale'>
            Batal
          </Form.Button>
          <Form.Button type='submit' className='btn-green'>
            Buat Pesanan Pembelian
          </Form.Button>
        </div>
      </Form>
    </div>
  )
}
