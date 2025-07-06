import { toast as sonnerToast } from 'sonner'
import React from 'react'
import { AlertBody, AlertButton, AlertContainer, AlertTitle } from './alert'
import { Icons } from '../icons'

interface ToastProps {
  title?: string
  body?: string
  action?: string
  callback?: () => void
}

const Info = ({ title = 'This is an info alerts', body, action = '', callback }: ToastProps) =>
  sonnerToast.custom((t) => (
    <AlertContainer className='bg-greyscale-0 flex items-center justify-between shadow-md lg:max-w-[370px] 2xl:max-w-[600px]'>
      <div className='flex items-center gap-2'>
        <Icons.Info className='text-blue-7 h-[40px] w-[40px]' />
        <div className='flex flex-col gap-1'>
          <AlertTitle className='text-greyscale-9'>{title ?? 'This is an alerts'}</AlertTitle>
          <AlertBody className='text-greyscale-6'>
            {body ?? 'Body alerts caption should put right here, to inform the user'}
          </AlertBody>
        </div>
      </div>
      <button onClick={() => sonnerToast.dismiss(t)}>
        <Icons.X className='text-greyscale-6 h-5 w-5' />
      </button>
      {action && (
        <AlertButton
          onClick={() => {
            if (callback) callback()
            sonnerToast.dismiss(t)
          }}
          className='btn-blue'
        >
          {action}
        </AlertButton>
      )}
    </AlertContainer>
  ))

const Success = ({ title = 'This is a success alerts', body, action = '', callback }: ToastProps) =>
  sonnerToast.custom((t) => (
    <AlertContainer className='bg-greyscale-0 flex items-center justify-between shadow-md lg:max-w-[370px] 2xl:max-w-[600px]'>
      <div className='flex items-center gap-2'>
        <Icons.CircleCheck className='text-green-7 h-[40px] w-[40px]' />
        <div className='flex flex-col gap-1'>
          <AlertTitle className='text-greyscale-9'>{title ?? 'This is an alerts'}</AlertTitle>
          <AlertBody className='text-greyscale-6'>
            {body ?? 'Body alerts caption should put right here, to inform the user'}
          </AlertBody>
        </div>
      </div>
      <button onClick={() => sonnerToast.dismiss(t)}>
        <Icons.X className='text-greyscale-6 h-5 w-5' />
      </button>
      {action && (
        <AlertButton
          onClick={() => {
            if (callback) callback()
            sonnerToast.dismiss(t)
          }}
          className='btn-green'
        >
          {action}
        </AlertButton>
      )}
    </AlertContainer>
  ))

const Error = ({ title = 'This is an error alerts', body, action = '', callback }: ToastProps) =>
  sonnerToast.custom((t) => (
    <AlertContainer className='bg-greyscale-0 flex items-center justify-between shadow-md lg:max-w-[370px] 2xl:max-w-[600px]'>
      <div className='flex gap-2'>
        <Icons.TriangleAlert className='text-red-7 h-[40px] w-[40px]' />
        <div className='flex flex-col gap-1'>
          <AlertTitle className='text-greyscale-9'>{title ?? 'This is an alerts'}</AlertTitle>
          <AlertBody className='text-greyscale-6'>
            {body ?? 'Body alerts caption should put right here, to inform the user'}
          </AlertBody>
        </div>
      </div>
      <button onClick={() => sonnerToast.dismiss(t)}>
        <Icons.X className='text-greyscale-6 h-5 w-5' />
      </button>
      {action && (
        <AlertButton
          onClick={() => {
            if (callback) callback()
            sonnerToast.dismiss(t)
          }}
          className='btn-red'
        >
          {action}
        </AlertButton>
      )}
    </AlertContainer>
  ))

const toast = {
  info: Info,
  success: Success,
  error: Error,
}

export { toast }
