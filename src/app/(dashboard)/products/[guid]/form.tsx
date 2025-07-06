'use client'

import { toast } from '@/components/ui/alert/toast'
import Form from '@/components/ui/form'
import { InsertProducts, Products } from '@/schemas/products'
import { productsUpdate } from '@/service/products_service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export const FormUpdate = ({ data }: { data: Products }) => {
  const router = useRouter()
  const form = useForm<InsertProducts>({
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      originalPrice: '',
      profitMarginPercentage: '',
    },

    resolver: zodResolver(InsertProducts),
  })

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        originalPrice: data.originalPrice,
        profitMarginPercentage: data.profitMarginPercentage,
      })
    }
  }, [data, form])

  const onSave = async (formData: InsertProducts) => {
    try {
      await productsUpdate(data.guid, formData).then(() => {
        toast.success({
          title: 'Success',
          body: 'Berhasil memperbarui produk',
        })
        router.push('/products')
      })
    } catch (error) {
      if (error instanceof Error) {
        const validationErrors = JSON.parse(error.message)
        toast.error({
          title: 'Error',
          body: validationErrors[0].message || 'Failed to update product',
        })
      }
    }
  }

  return (
    <div className='card space-y-6'>
      <div className='space-y-1'>
        <h1 className='plabs-title-medium-20 text-greyscale-9'>Form Perbarui Produk</h1>
        <p className='plabs-body-regular-14 text-greyscale-6'>Perbarui produk Anda pada halaman ini.</p>
      </div>
      <div className='bg-primary-background plabs-title-medium-16 text-primary-base w-full rounded-2xl px-3 py-2.5'>
        Data Produk
      </div>
      <Form id='update_product' form={form} onSave={onSave} className='space-y-2'>
        <div className='flex flex-col'>
          <div className='border-greyscale-4 border-b py-2 sm:py-6'>
            <div className='w-full space-y-8 sm:w-[80%]'>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Nama Produk</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan nama produk.</p>
                </div>
                <Form.Input name={`name`} placeholder='Masukkan nama produk' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Deskripsi</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan deskripsi produk.</p>
                </div>
                <Form.Textarea name={`description`} placeholder='Masukkan deskripsi produk' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>URL Gambar</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan URL gambar produk (opsional).</p>
                </div>
                <Form.Input name={`imageUrl`} placeholder='https://example.com/image.jpg' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Harga Asli</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan harga asli produk.</p>
                </div>
                <Form.Input name={`originalPrice`} type='number' placeholder='100000' step='0.01' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Margin Keuntungan (%)</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan persentase margin keuntungan.</p>
                </div>
                <Form.Input name={`profitMarginPercentage`} type='number' placeholder='20' step='0.01' />
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
              Perbarui data produk
            </Form.Button>
          </div>
        </div>
      </Form>
    </div>
  )
}
