'use client'

import { toast } from '@/components/ui/alert/toast'
import Form from '@/components/ui/form'
import { InsertPeople } from '@/schemas/people'
import { peopleInsert } from '@/service/poeple_service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

export const FormCreate = () => {
  const router = useRouter()
  const form = useForm<InsertPeople>({
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

  const onSave = async (data: InsertPeople) => {
    try {
      await peopleInsert(data).then(() => {
        toast.success({
          title: 'Success',
          body: 'Berhasil menambahkan orang',
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
    <div className='card space-y-4 sm:space-y-6'>
      <div className='space-y-1'>
        <h1 className='plabs-title-medium-18 text-greyscale-9 sm:plabs-title-medium-20'>Form Tambah Orang</h1>
        <p className='plabs-body-regular-12 text-greyscale-6 sm:plabs-body-regular-14'>
          Tambah orang Anda pada halaman ini.
        </p>
      </div>
      <div className='bg-primary-background plabs-title-medium-14 text-primary-base sm:plabs-title-medium-16 w-full rounded-xl px-3 py-2.5 sm:rounded-2xl'>
        Data Orang
      </div>
      <Form id='create_orang' form={form} onSave={onSave} className='space-y-2'>
        <div className='flex flex-col'>
          <div className='border-greyscale-4 border-b py-2 sm:py-6'>
            <div className='w-full space-y-6 sm:w-[80%] sm:space-y-8'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-14 text-greyscale-6 sm:plabs-title-medium-16'>Nama Depan</h3>
                  <p className='plabs-body-regular-12 text-greyscale-5 sm:plabs-body-regular-14'>
                    Masukkan nama depan orang.
                  </p>
                </div>
                <Form.Input name={`first_name`} placeholder='Masukkan nama depan' />
              </div>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-14 text-greyscale-6 sm:plabs-title-medium-16'>Nama Belakang</h3>
                  <p className='plabs-body-regular-12 text-greyscale-5 sm:plabs-body-regular-14'>
                    Masukkan nama belakang orang.
                  </p>
                </div>
                <Form.Input name={`last_name`} placeholder='Masukkan nama belakang' />
              </div>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-14 text-greyscale-6 sm:plabs-title-medium-16'>Email</h3>
                  <p className='plabs-body-regular-12 text-greyscale-5 sm:plabs-body-regular-14'>
                    Masukkan email orang.
                  </p>
                </div>
                <Form.Input name={`email`} placeholder='Masukkan email' />
              </div>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-14 text-greyscale-6 sm:plabs-title-medium-16'>No. Telepon</h3>
                  <p className='plabs-body-regular-12 text-greyscale-5 sm:plabs-body-regular-14'>
                    Masukkan no. telepon orang.
                  </p>
                </div>
                <Form.Input name={`phone`} placeholder='Masukkan no. telepon' />
              </div>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-14 text-greyscale-6 sm:plabs-title-medium-16'>Alamat</h3>
                  <p className='plabs-body-regular-12 text-greyscale-5 sm:plabs-body-regular-14'>
                    Masukkan alamat orang.
                  </p>
                </div>
                <Form.Input name={`address`} placeholder='Masukkan alamat' />
              </div>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-14 text-greyscale-6 sm:plabs-title-medium-16'>Kota</h3>
                  <p className='plabs-body-regular-12 text-greyscale-5 sm:plabs-body-regular-14'>
                    Masukkan kota orang.
                  </p>
                </div>
                <Form.Input name={`city`} placeholder='Masukkan kota' />
              </div>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-14 text-greyscale-6 sm:plabs-title-medium-16'>Provinsi</h3>
                  <p className='plabs-body-regular-12 text-greyscale-5 sm:plabs-body-regular-14'>
                    Masukkan provinsi orang.
                  </p>
                </div>
                <Form.Input name={`state`} placeholder='Masukkan provinsi' />
              </div>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-14 text-greyscale-6 sm:plabs-title-medium-16'>Negara</h3>
                  <p className='plabs-body-regular-12 text-greyscale-5 sm:plabs-body-regular-14'>
                    Masukkan negara orang.
                  </p>
                </div>
                <Form.Input name={`country`} placeholder='Masukkan negara' />
              </div>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center'>
                <div className='flex flex-col justify-center'>
                  <h3 className='plabs-title-medium-14 text-greyscale-6 sm:plabs-title-medium-16'>Kode Pos</h3>
                  <p className='plabs-body-regular-12 text-greyscale-5 sm:plabs-body-regular-14'>
                    Masukkan kode pos orang.
                  </p>
                </div>
                <Form.Input name={`zip`} placeholder='Masukkan kode pos' />
              </div>
            </div>
          </div>
        </div>
        <div className='flex w-full justify-end gap-2'>
          <div className='flex flex-col gap-2 sm:flex-row'>
            <Form.Button
              onClick={() => router.back()}
              type='button'
              className='btn-outline-greyscale text-xs sm:text-sm'
            >
              Batal
            </Form.Button>
            <Form.Button type='submit' className='btn-green text-xs sm:text-sm'>
              <span className='hidden sm:inline'>Simpan data orang</span>
              <span className='sm:hidden'>Simpan</span>
            </Form.Button>
          </div>
        </div>
      </Form>
    </div>
  )
}
