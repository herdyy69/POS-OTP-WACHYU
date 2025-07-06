'use client'

import { toast } from '@/components/ui/alert/toast'
import Form from '@/components/ui/form'
import { InsertStores, Stores } from '@/schemas/stores'
import { storesUpdate } from '@/service/stores_service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export const FormUpdate = ({ data }: { data: Stores }) => {
  const router = useRouter()
  const form = useForm<InsertStores>({
    defaultValues: {
      name: '',
      ownerName: '',
      fullAddress: '',
      phoneNumber: '',
      notes: '',
    },

    resolver: zodResolver(InsertStores),
  })

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        ownerName: data.ownerName,
        fullAddress: data.fullAddress,
        phoneNumber: data.phoneNumber,
        notes: data.notes || '',
      })
    }
  }, [data, form])

  const onSave = async (formData: InsertStores) => {
    try {
      await storesUpdate(data.guid, formData).then(() => {
        toast.success({
          title: 'Success',
          body: 'Berhasil memperbarui toko',
        })
        router.push('/stores')
      })
    } catch (error) {
      if (error instanceof Error) {
        const validationErrors = JSON.parse(error.message)
        toast.error({
          title: 'Error',
          body: validationErrors[0].message || 'Failed to update store',
        })
      }
    }
  }

  return (
    <div className='card space-y-6'>
      <div className='space-y-1'>
        <h1 className='plabs-title-medium-20 text-greyscale-9'>Form Perbarui Toko</h1>
        <p className='plabs-body-regular-14 text-greyscale-6'>Perbarui toko Anda pada halaman ini.</p>
      </div>
      <div className='bg-primary-background plabs-title-medium-16 text-primary-base w-full rounded-2xl px-3 py-2.5'>
        Data Toko
      </div>
      <Form id='update_store' form={form} onSave={onSave} className='space-y-2'>
        <div className='flex flex-col'>
          <div className='border-greyscale-4 border-b py-2 sm:py-6'>
            <div className='w-full space-y-8 sm:w-[80%]'>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Nama Toko</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan nama toko.</p>
                </div>
                <Form.Input name={`name`} placeholder='Masukkan nama toko' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Nama Pemilik</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan nama pemilik toko.</p>
                </div>
                <Form.Input name={`ownerName`} placeholder='Masukkan nama pemilik' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Alamat Lengkap</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan alamat lengkap toko.</p>
                </div>
                <Form.Textarea name={`fullAddress`} placeholder='Masukkan alamat lengkap' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>No. Telepon</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan nomor telepon toko.</p>
                </div>
                <Form.Input name={`phoneNumber`} placeholder='Masukkan nomor telepon' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Catatan</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan catatan tambahan (opsional).</p>
                </div>
                <Form.Textarea name={`notes`} placeholder='Masukkan catatan' />
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
              Perbarui data toko
            </Form.Button>
          </div>
        </div>
      </Form>
    </div>
  )
}
