'use client'

import Form from '@/components/ui/form'
import { Register as RegisterSchemas } from '../../../../_server/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { authClient } from '@/lib/auth-client'
import { toast } from '@/components/ui/alert/toast'

const Register = () => {
  const form = useForm<RegisterSchemas>({
    defaultValues: {
      email: '',
      password: '',
      password_confirm: '',
      name: '',
    },
    resolver: zodResolver(RegisterSchemas),
  })

  const onSave = async (data: RegisterSchemas) => {
    try {
      const { data: responseData, error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      })

      if (error) {
        throw new Error(error.message)
      }

      toast.success({
        title: 'Register Berhasil',
        body: `Halo ${responseData?.user?.name || 'User'} Selamat datang di aplikasi kami.`,
      })
    } catch (err: any) {
      toast.error({
        title: 'Register Gagal',
        body: 'Email yang anda masukkan sudah terdaftar, silahkan gunakan email lain.',
      })
    }
  }

  return (
    <div className='space-y-8'>
      <div className='space-y-1.5'>
        <h1 className='plabs-headline-semibold-28 text-greyscale-8'>Selamat Datang</h1>
        <p className='plabs-body-regular-16 text-greyscale-5'>
          Masukkan email dan password untuk akses akun. Jika sudah memiliki akun, silahkan{' '}
          <Link href={'/auth/login'} className='text-green-500'>
            Masuk
          </Link>
          .
        </p>
      </div>
      <Form id='register_form' form={form} onSave={onSave} className='space-y-8'>
        <div className='flex w-full flex-col gap-y-3'>
          <Form.Input label={'Nama Lengkap'} placeholder='Masukkan nama lengkap' name='name' />
          <Form.Input icon={<Mail />} label={'Email'} placeholder='Masukkan email' name='email' />
          <Form.Password label={'Password'} placeholder='Masukkan password' name='password' />
          <Form.Password label={'Konfirmasi Password'} placeholder='Konfirmasi password' name='password_confirm' />
        </div>
        <Form.Button className='btn-green flex w-full justify-center rounded-lg' type='submit'>
          Daftar
        </Form.Button>
      </Form>
    </div>
  )
}

export default Register
