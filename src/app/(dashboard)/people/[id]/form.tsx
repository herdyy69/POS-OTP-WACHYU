'use client'

import { toast } from '@/components/ui/alert/toast'
import Form from '@/components/ui/form'
import { InsertPeople, People } from '@/schemas/people'
import { peopleUpdate } from '@/service/poeple_service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export const FormUpdate = ({ data }: { data: People }) => {
  const router = useRouter()
  const form = useForm<People>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zip: '',
    },

    resolver: zodResolver(InsertPeople),
  })

  useEffect(() => {
    if (data) {
      form.reset({
        guid: data.guid,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        zip: data.zip,
      })
    }
  }, [data, form])

  const onSave = async (data: InsertPeople) => {
    try {
      await peopleUpdate(form.getValues('guid'), data).then(() => {
        toast.success({
          title: 'Success',
          body: 'Berhasil memperbarui orang',
        })
        form.reset()
        router.push('/people')
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

  return (
    <div className='card space-y-6'>
      <div className='space-y-1'>
        <h1 className='plabs-title-medium-20 text-greyscale-9'>Form Perbarui Orang</h1>
        <p className='plabs-body-regular-14 text-greyscale-6'>Perbarui orang Anda pada halaman ini.</p>
      </div>
      <div className='bg-primary-background plabs-title-medium-16 text-primary-base w-full rounded-2xl px-3 py-2.5'>
        Data Orang
      </div>
      <Form id='create_orang' form={form} onSave={onSave} className='space-y-2'>
        <div className='flex flex-col'>
          <div className='border-greyscale-4 border-b py-2 sm:py-6'>
            <div className='w-full space-y-8 sm:w-[80%]'>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Nama Depan</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan nama depan orang.</p>
                </div>
                <Form.Input name={`first_name`} placeholder='Masukkan nama depan' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Nama Belakang</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan nama belakang orang.</p>
                </div>
                <Form.Input name={`last_name`} placeholder='Masukkan nama belakang' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Email</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan email orang.</p>
                </div>
                <Form.Input name={`email`} placeholder='Masukkan email' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>No. Telepon</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan no. telepon orang.</p>
                </div>
                <Form.Input name={`phone`} placeholder='Masukkan no. telepon' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Alamat</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan alamat orang.</p>
                </div>
                <Form.Input name={`address`} placeholder='Masukkan alamat' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Kota</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan kota orang.</p>
                </div>
                <Form.Input name={`city`} placeholder='Masukkan kota' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Provinsi</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan provinsi orang.</p>
                </div>
                <Form.Input name={`state`} placeholder='Masukkan provinsi' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Negara</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan negara orang.</p>
                </div>
                <Form.Input name={`country`} placeholder='Masukkan negara' />
              </div>
              <div className='grid grid-cols-2 items-center gap-2'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-16 text-greyscale-6'>Kode Pos</h3>
                  <p className='plabs-body-regular-14 text-greyscale-5'>Masukkan kode pos orang.</p>
                </div>
                <Form.Input name={`zip`} placeholder='Masukkan kode pos' />
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
              Simpan data orang
            </Form.Button>
          </div>
        </div>
      </Form>
    </div>
  )
}
