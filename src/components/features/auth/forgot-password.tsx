'use client'

import Form from '@/components/ui/form'
import { ForgotPassword as ForgotPasswordSchemas } from '../../../../_server/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

const ForgotPassword = () => {
  const form = useForm<ForgotPasswordSchemas>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(ForgotPasswordSchemas),
  })

  const onSave = (data: ForgotPasswordSchemas) => {}

  return (
    <div className='space-y-8'>
      <div className='space-y-1.5'>
        <h1 className='plabs-headline-semibold-28 text-greyscale-8'>Lupa Password</h1>
        <p className='plabs-body-regular-16 text-greyscale-5'>Masukkan email Anda untuk mengirim link reset.</p>
      </div>
      <div className=''></div>
      <Form id='forgot_password_form' form={form} onSave={onSave} className='space-y-8'>
        <div className='flex w-full flex-col gap-y-3'>
          <Form.Input icon={<Mail />} label={'Email'} placeholder='Masukkan email' name='email' />
        </div>
        <div className='flex w-full flex-col items-center gap-3'>
          <Form.Button className='btn-green flex w-full justify-center rounded-lg' type='submit'>
            Kirim Link Reset
          </Form.Button>
          <Link href={'/auth/login'} className='plabs-title-medium-14 text-greyscale-6'>
            Kembali ke halaman login
          </Link>
        </div>
      </Form>
    </div>
  )
}

export default ForgotPassword
