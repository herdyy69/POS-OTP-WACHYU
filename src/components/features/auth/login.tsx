'use client'

import Form from '@/components/ui/form'
import { Login as LoginSchemas } from '../../../../_server/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { authClient } from '@/lib/auth-client'
import { toast } from '@/components/ui/alert/toast'

const Login = () => {
  const form = useForm<LoginSchemas>({
    defaultValues: {
      email: 'admin@gmail.com',
      password: 'password',
      user_agent: '',
    },
    resolver: zodResolver(LoginSchemas),
  })

  const onSave = async (data: LoginSchemas) => {
    try {
      const { data: responseData, error } = await authClient.signIn.email({
        email: data.email ?? '',
        password: data.password,
      })

      if (error) {
        throw new Error(error.message)
      }

      toast.success({
        title: 'Login Berhasil',
        body: `Halo ${responseData?.user?.name || 'User'} Selamat datang kembali.`,
      })
    } catch (err: any) {
      toast.error({
        title: 'Login Gagal',
        body: 'Email yang anda masukkan tidak valid, masukkan email yang benar.',
      })
    }
  }

  return (
    <div className='space-y-8'>
      <div className='space-y-1.5'>
        <h1 className='plabs-headline-semibold-28 text-greyscale-8'>Selamat Datang</h1>
        <p className='plabs-body-regular-16 text-greyscale-5'>Masukkan email dan password untuk akses akun.</p>
      </div>
      <div className=''></div>
      <Form id='login_form' form={form} onSave={onSave} className='space-y-8'>
        <div className='flex w-full flex-col gap-y-3'>
          <Form.Input icon={<Mail />} label={'Email'} placeholder='Masukkan email' name='email' />
          <Form.Password label={'Password'} placeholder='Masukkan password' name='password' />
          <Link href={'/auth/forgot-password'} className='plabs-title-regular-12 text-greyscale-6'>
            Lupa Password ?
          </Link>
        </div>
        <Form.Button className='btn-green flex w-full justify-center rounded-lg' type='submit'>
          Masuk
        </Form.Button>
      </Form>
    </div>
  )
}

export default Login
