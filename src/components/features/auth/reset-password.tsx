'use client'

import Form from '@/components/ui/form'
import { ResetPassword as ResetPasswordSchemas } from '../../../../_server/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

const ResetPassword = () => {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token') || ''
  const email = params.get('email') || ''

  useEffect(() => {
    if (!token || !email) {
      router.push('/auth/login')
    }
  }, [token, email])

  const form = useForm<ResetPasswordSchemas>({
    defaultValues: {
      token: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
    resolver: zodResolver(ResetPasswordSchemas),
  })

  const onSave = (data: ResetPasswordSchemas) => {}

  return (
    <div className='space-y-8'>
      <div className='space-y-1.5'>
        <h1 className='plabs-headline-semibold-28 text-greyscale-8'>Reset Password</h1>
        <p className='plabs-body-regular-16 text-greyscale-5'>Masukkan password baru Anda pada form dibawah ini.</p>
      </div>
      <div className=''></div>
      <Form id='reset_password_form' form={form} onSave={onSave} className='space-y-8'>
        <div className='flex w-full flex-col gap-y-3'>
          <Form.Password label={'Password Baru'} placeholder='Masukkan password baru' name='password' />
          <Form.Password label={'Konfirmasi Password'} placeholder='Konfirmasi password' name='password_confirmation' />
        </div>
        <Form.Button className='btn-green flex w-full justify-center rounded-lg' type='submit' disabled={false}>
          Simpan Password
        </Form.Button>
      </Form>
    </div>
  )
}

export default ResetPassword
